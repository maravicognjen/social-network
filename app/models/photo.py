from app import db
from datetime import datetime

class Photo(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    image = db.Column(db.String(255),nullable = False)
    descretion = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        default = datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable = False
    )