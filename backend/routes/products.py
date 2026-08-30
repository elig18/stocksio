from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Product, StockMovement, Warehouse
import csv
import io
from flask import Response

products_bp = Blueprint('products', __name__)


def _user_product_query(user_id):
    """Ne renvoie que les produits dont l'entrepôt appartient au user connecté."""
    return Product.query.join(Warehouse).filter(Warehouse.user_id == user_id)


def _get_owned_product_or_404(product_id, user_id):
    product = _user_product_query(user_id).filter(Product.id == product_id).first()
    if not product:
        from flask import abort
        abort(404)
    return product


# Liste des produits
@products_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '')

    query = _user_product_query(user_id)
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))

    products = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'success': True,
        'data': [p.to_dict() for p in products.items],
        'total': products.total,
        'pages': products.pages,
        'current_page': page
    }), 200


# Détail d'un produit
@products_bp.route('/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    user_id = get_jwt_identity()
    product = _get_owned_product_or_404(product_id, user_id)
    return jsonify({'success': True, 'data': product.to_dict()}), 200


# Créer un produit
@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('name') or not data.get('warehouse_id'):
        return jsonify({'success': False, 'message': 'Nom et entrepôt requis'}), 400

    # Vérifie que l'entrepôt cible appartient bien au user connecté
    warehouse = Warehouse.query.filter_by(id=data['warehouse_id'], user_id=user_id).first()
    if not warehouse:
        return jsonify({'success': False, 'message': 'Entrepôt introuvable'}), 404

    product = Product(
        name=data['name'],
        reference=data.get('reference'),
        category=data.get('category'),
        quantity=data.get('quantity', 0),
        alert_threshold=data.get('alert_threshold', 5),
        unit=data.get('unit', 'unité'),
        warehouse_id=data['warehouse_id']
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Produit créé', 'data': product.to_dict()}), 201


# Modifier un produit
@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    user_id = get_jwt_identity()
    product = _get_owned_product_or_404(product_id, user_id)
    data = request.get_json()

    if data.get('warehouse_id'):
        # Si le produit change d'entrepôt, vérifie que le nouvel entrepôt appartient aussi au user
        new_warehouse = Warehouse.query.filter_by(id=data['warehouse_id'], user_id=user_id).first()
        if not new_warehouse:
            return jsonify({'success': False, 'message': 'Entrepôt introuvable'}), 404
        product.warehouse_id = data['warehouse_id']

    if data.get('name'):
        product.name = data['name']
    if data.get('reference'):
        product.reference = data['reference']
    if data.get('category'):
        product.category = data['category']
    if data.get('quantity') is not None:
        product.quantity = data['quantity']
    if data.get('alert_threshold') is not None:
        product.alert_threshold = data['alert_threshold']
    if data.get('unit'):
        product.unit = data['unit']

    db.session.commit()

    return jsonify({'success': True, 'message': 'Produit mis à jour', 'data': product.to_dict()}), 200


# Supprimer un produit
@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user_id = get_jwt_identity()
    product = _get_owned_product_or_404(product_id, user_id)
    db.session.delete(product)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Produit supprimé'}), 200


# export CSV
@products_bp.route('/export', methods=['GET'])
@jwt_required()
def export_csv():
    user_id = get_jwt_identity()
    products = _user_product_query(user_id).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Nom', 'Référence', 'Catégorie', 'Quantité', 'Seuil alerte', 'Unité', 'Entrepôt ID', 'En alerte'])

    for p in products:
        writer.writerow([
            p.name, p.reference, p.category,
            p.quantity, p.alert_threshold, p.unit,
            p.warehouse_id, 'Oui' if p.is_low_stock() else 'Non'
        ])

    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=stocks.csv'}
    )

    # Import CSV (ajout de plusieurs produits en une fois)
@products_bp.route('/import', methods=['POST'])
@jwt_required()
def import_csv():
    user_id = get_jwt_identity()

    warehouse_id = request.form.get('warehouse_id', type=int)
    if not warehouse_id:
        return jsonify({'success': False, 'message': 'Entrepôt requis'}), 400

    warehouse = Warehouse.query.filter_by(id=warehouse_id, user_id=user_id).first()
    if not warehouse:
        return jsonify({'success': False, 'message': 'Entrepôt introuvable'}), 404

    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'Aucun fichier reçu'}), 400

    file = request.files['file']
    if not file.filename.lower().endswith('.csv'):
        return jsonify({'success': False, 'message': 'Le fichier doit être au format .csv'}), 400

    try:
        content = file.stream.read().decode('utf-8-sig')
    except UnicodeDecodeError:
        return jsonify({'success': False, 'message': "Impossible de lire le fichier (encodage attendu : UTF-8)"}), 400

    reader = csv.DictReader(io.StringIO(content))

    required_columns = {'Nom'}
    if not reader.fieldnames or not required_columns.issubset(set(reader.fieldnames)):
        return jsonify({
            'success': False,
            'message': "En-têtes attendues manquantes. Colonnes minimales : Nom (optionnelles : Référence, Catégorie, Quantité, Seuil alerte, Unité)"
        }), 400

    created = []
    errors = []

    for i, row in enumerate(reader, start=2):
        name = (row.get('Nom') or '').strip()
        if not name:
            errors.append(f"Ligne {i} : nom manquant, ignorée")
            continue

        def _to_int(value, default):
            try:
                return int(str(value).strip())
            except (TypeError, ValueError):
                return default

        product = Product(
            name=name,
            reference=(row.get('Référence') or '').strip() or None,
            category=(row.get('Catégorie') or '').strip() or None,
            quantity=_to_int(row.get('Quantité'), 0),
            alert_threshold=_to_int(row.get('Seuil alerte'), 5),
            unit=(row.get('Unité') or '').strip() or 'unité',
            warehouse_id=warehouse_id,
        )
        db.session.add(product)
        created.append(product)

    db.session.commit()

    return jsonify({
        'success': True,
        'message': f"{len(created)} produit(s) importé(s)" + (f", {len(errors)} ligne(s) ignorée(s)" if errors else ''),
        'data': [p.to_dict() for p in created],
        'errors': errors,
    }), 201
