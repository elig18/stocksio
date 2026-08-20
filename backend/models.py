from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'admin' ou 'user'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    warehouses = db.relationship('Warehouse', backref='owner', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }


class Warehouse(db.Model):
    __tablename__ = 'warehouses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    products = db.relationship('Product', backref='warehouse', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat()
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    reference = db.Column(db.String(50), unique=True)
    category = db.Column(db.String(50))
    quantity = db.Column(db.Integer, default=0)
    alert_threshold = db.Column(db.Integer, default=5)  # seuil d'alerte
    unit = db.Column(db.String(20), default='unité')
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    movements = db.relationship('StockMovement', backref='product', lazy=True)

    def is_low_stock(self):
        return self.quantity <= self.alert_threshold

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'reference': self.reference,
            'category': self.category,
            'quantity': self.quantity,
            'alert_threshold': self.alert_threshold,
            'unit': self.unit,
            'warehouse_id': self.warehouse_id,
            'is_low_stock': self.is_low_stock(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class StockMovement(db.Model):
    __tablename__ = 'stock_movements'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)  # positif = entrée, négatif = sortie
    movement_type = db.Column(db.String(20), nullable=False)  # 'entree' ou 'sortie'
    note = db.Column(db.String(255))
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'movement_type': self.movement_type,
            'note': self.note,
            'date': self.date.isoformat()
        }