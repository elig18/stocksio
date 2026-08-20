from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Product, StockMovement
import csv
import io
from flask import Response

products_bp = Blueprint('products', __name__)


# Liste des mouvements 
@products_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '')

    query = Product.query
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


# Détail d'un mouvement
@products_bp.route('/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({'success': True, 'data': product.to_dict()}), 200


# Créer un produit
@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json()

    if not data or not data.get('name') or not data.get('warehouse_id'):
        return jsonify({'success': False, 'message': 'Nom et entrepôt requis'}), 400

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
    product = Product.query.get_or_404(product_id)
    data = request.get_json()

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
    if data.get('warehouse_id'):
        product.warehouse_id = data['warehouse_id']

    db.session.commit()

    return jsonify({'success': True, 'message': 'Produit mis à jour', 'data': product.to_dict()}), 200


# Surppimer un produit
@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Produit supprimé'}), 200


# export CSV
@products_bp.route('/export', methods=['GET'])
@jwt_required()
def export_csv():
    products = Product.query.all()

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