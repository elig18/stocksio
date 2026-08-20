from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from models import User

auth_bp = Blueprint('auth', __name__)


# Inscription
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'message': 'Email et mot de passe requis'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'message': 'Email déjà utilisé'}), 400

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(email=data['email'], password=hashed_pw)

    db.session.add(user)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Compte créé avec succès'}), 201


# Connexion
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'message': 'Email et mot de passe requis'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'success': False, 'message': 'Identifiants incorrects'}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        'success': True,
        'token': token,
        'user': user.to_dict()
    }), 200


# Profil
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'success': False, 'message': 'Utilisateur introuvable'}), 404

    return jsonify({'success': True, 'data': user.to_dict()}), 200


# modification de son compte
@auth_bp.route('/update', methods=['PUT'])
@jwt_required()
def update():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if data.get('email'):
        user.email = data['email']
    if data.get('password'):
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    db.session.commit()

    return jsonify({'success': True, 'message': 'Compte mis à jour', 'data': user.to_dict()}), 200


# Supprimer son compte
@auth_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    db.session.delete(user)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Compte supprimé'}), 200