from app import db
from datetime import datetime

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)

    text = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255))

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    deleted_at = db.Column(db.DateTime, nullable=True)