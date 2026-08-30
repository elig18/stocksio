from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Product, StockMovement, Warehouse

dashboard_bp = Blueprint('dashboard', __name__)


def _user_product_query(user_id):
    return Product.query.join(Warehouse).filter(Warehouse.user_id == user_id)


# Statistiques — restreintes aux entrepôts du user connecté
@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()

    product_query = _user_product_query(user_id)
    total_products = product_query.count()
    total_warehouses = Warehouse.query.filter_by(user_id=user_id).count()

    # Produits en alerte (quantité <= seuil)
    products_in_alert = product_query.filter(
        Product.quantity <= Product.alert_threshold
    ).all()

    # Stock total (somme de toutes les quantités)
    total_stock = db.session.query(
        db.func.sum(Product.quantity)
    ).join(Warehouse).filter(Warehouse.user_id == user_id).scalar() or 0

    # 5 derniers mouvements
    recent_movements = StockMovement.query.join(Product).join(Warehouse).filter(
        Warehouse.user_id == user_id
    ).order_by(StockMovement.date.desc()).limit(5).all()

    # Répartition par catégorie
    categories = db.session.query(
        Product.category,
        db.func.sum(Product.quantity).label('total')
    ).join(Warehouse).filter(Warehouse.user_id == user_id).group_by(Product.category).all()

    return jsonify({
        'success': True,
        'data': {
            'total_products': total_products,
            'total_warehouses': total_warehouses,
            'total_stock': total_stock,
            'alerts_count': len(products_in_alert),
            'products_in_alert': [p.to_dict() for p in products_in_alert],
            'recent_movements': [m.to_dict() for m in recent_movements],
            'categories': [
                {'category': c.category or 'Sans catégorie', 'total': int(c.total)}
                for c in categories
            ]
        }
    }), 200


# Alertes uniquement
@dashboard_bp.route('/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    user_id = get_jwt_identity()
    alerts = _user_product_query(user_id).filter(
        Product.quantity <= Product.alert_threshold
    ).order_by(Product.quantity.asc()).all()

    return jsonify({
        'success': True,
        'data': [p.to_dict() for p in alerts],
        'count': len(alerts)
    }), 200
