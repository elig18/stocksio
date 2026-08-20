from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Warehouse

warehouses_bp = Blueprint('warehouses', __name__)


# Liste des entrepots
@warehouses_bp.route('/', methods=['GET'])
@jwt_required()
def get_warehouses():
    user_id = get_jwt_identity()
    warehouses = Warehouse.query.filter_by(user_id=user_id).all()

    return jsonify({
        'success': True,
        'data': [w.to_dict() for w in warehouses]
    }), 200


# Détails des entrepots
@warehouses_bp.route('/<int:warehouse_id>', methods=['GET'])
@jwt_required()
def get_warehouse(warehouse_id):
    user_id = get_jwt_identity()
    warehouse = Warehouse.query.filter_by(id=warehouse_id, user_id=user_id).first_or_404()

    return jsonify({'success': True, 'data': warehouse.to_dict()}), 200


# Créer un entrepot
@warehouses_bp.route('/', methods=['POST'])
@jwt_required()
def create_warehouse():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'success': False, 'message': 'Nom de l entrepôt requis'}), 400

    warehouse = Warehouse(
        name=data['name'],
        location=data.get('location', ''),
        user_id=user_id
    )

    db.session.add(warehouse)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Entrepôt créé', 'data': warehouse.to_dict()}), 201


# Modifier un entrepot
@warehouses_bp.route('/<int:warehouse_id>', methods=['PUT'])
@jwt_required()
def update_warehouse(warehouse_id):
    user_id = get_jwt_identity()
    warehouse = Warehouse.query.filter_by(id=warehouse_id, user_id=user_id).first_or_404()
    data = request.get_json()

    if data.get('name'):
        warehouse.name = data['name']
    if data.get('location'):
        warehouse.location = data['location']

    db.session.commit()

    return jsonify({'success': True, 'message': 'Entrepôt mis à jour', 'data': warehouse.to_dict()}), 200


# Supprimer un entreprot
@warehouses_bp.route('/<int:warehouse_id>', methods=['DELETE'])
@jwt_required()
def delete_warehouse(warehouse_id):
    user_id = get_jwt_identity()
    warehouse = Warehouse.query.filter_by(id=warehouse_id, user_id=user_id).first_or_404()

    db.session.delete(warehouse)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Entrepôt supprimé'}), 200