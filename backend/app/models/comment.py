from app import db
from datetime import datetime

class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.Text,nullable = False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    post_id = db.Column(
        db.Integer,
        db.ForeignKey("posts.id")
    )

    photo_id = db.Column(
        db.Integer,
        db.ForeignKey("photos.id")
    )