from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Product, StockMovement, Warehouse

movements_bp = Blueprint('movements', __name__)


def _get_owned_product_or_404(product_id, user_id):
    """Vérifie que le produit appartient à un entrepôt du user connecté."""
    product = Product.query.join(Warehouse).filter(
        Product.id == product_id, Warehouse.user_id == user_id
    ).first()
    if not product:
        abort(404)
    return product


def _get_owned_movement_or_404(movement_id, user_id):
    movement = StockMovement.query.join(Product).join(Warehouse).filter(
        StockMovement.id == movement_id, Warehouse.user_id == user_id
    ).first()
    if not movement:
        abort(404)
    return movement


# Liste des mouvements (tous ou par produit) — restreints aux entrepôts du user
@movements_bp.route('/', methods=['GET'])
@jwt_required()
def get_movements():
    user_id = get_jwt_identity()
    product_id = request.args.get('product_id', type=int)

    query = StockMovement.query.join(Product).join(Warehouse).filter(Warehouse.user_id == user_id)
    if product_id:
        query = query.filter(StockMovement.product_id == product_id)

    movements = query.order_by(StockMovement.date.desc()).limit(50).all()

    return jsonify({
        'success': True,
        'data': [m.to_dict() for m in movements]
    }), 200


# Ajouter un mouvement (entrée ou sortie)
@movements_bp.route('/', methods=['POST'])
@jwt_required()
def add_movement():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('product_id') or not data.get('quantity') or not data.get('movement_type'):
        return jsonify({'success': False, 'message': 'product_id, quantity et movement_type requis'}), 400

    if data['movement_type'] not in ['entree', 'sortie']:
        return jsonify({'success': False, 'message': 'movement_type doit être entree ou sortie'}), 400

    product = _get_owned_product_or_404(data['product_id'], user_id)

    # Mise à jour de la quantité du produit
    if data['movement_type'] == 'entree':
        product.quantity += data['quantity']
    else:
        if product.quantity < data['quantity']:
            return jsonify({'success': False, 'message': 'Stock insuffisant pour cette sortie'}), 400
        product.quantity -= data['quantity']

    # Enregistrement du mouvement
    movement = StockMovement(
        product_id=data['product_id'],
        quantity=data['quantity'],
        movement_type=data['movement_type'],
        note=data.get('note', '')
    )

    db.session.add(movement)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Mouvement enregistré',
        'data': movement.to_dict(),
        'stock_actuel': product.quantity,
        'alerte': product.is_low_stock()
    }), 201


# Supprimer un mouvement
@movements_bp.route('/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_movement(movement_id):
    user_id = get_jwt_identity()
    movement = _get_owned_movement_or_404(movement_id, user_id)

    # On remet la quantité du produit à son état avant le mouvement
    product = Product.query.get(movement.product_id)
    if movement.movement_type == 'entree':
        product.quantity -= movement.quantity
    else:
        product.quantity += movement.quantity

    db.session.delete(movement)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Mouvement supprimé'}), 200
