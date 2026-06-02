from app import db
from flask_login import UserMixin

class user(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    birth_date = db.Column(db.Date)
    gender = db.Column(db.String(20))
    role = db.Column(db.String(20), default="USER")
    profile_image = db.Column(db.String(255))
    is_private = db.Column(db.Boolean, default=False)

