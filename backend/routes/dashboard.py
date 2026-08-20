from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app import db
from models import Product, StockMovement, Warehouse

dashboard_bp = Blueprint('dashboard', __name__)


# Statistiques
@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    total_products = Product.query.count()
    total_warehouses = Warehouse.query.count()

    # Produits en alerte (quantité <= seuil)
    products_in_alert = Product.query.filter(
        Product.quantity <= Product.alert_threshold
    ).all()

    # Stock total (somme de toutes les quantités)
    total_stock = db.session.query(
        db.func.sum(Product.quantity)
    ).scalar() or 0

    # 5 derniers mouvements
    recent_movements = StockMovement.query.order_by(
        StockMovement.date.desc()
    ).limit(5).all()

    # Répartition par catégorie
    categories = db.session.query(
        Product.category,
        db.func.sum(Product.quantity).label('total')
    ).group_by(Product.category).all()

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


# Altertes uniquement
@dashboard_bp.route('/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    alerts = Product.query.filter(
        Product.quantity <= Product.alert_threshold
    ).order_by(Product.quantity.asc()).all()

    return jsonify({
        'success': True,
        'data': [p.to_dict() for p in alerts],
        'count': len(alerts)
    }), 200