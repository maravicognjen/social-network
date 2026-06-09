from flask import Blueprint,request,jsonify
from flask_login import login_required,current_user
from datetime import datetime
from sqlalchemy import or_
from app import db
from app.models.user import User
from app.models.post import Post
from app.models.photo import Photo
from app.models.message import Message 

admin_bp = Blueprint("admin",__name__)

def admin_required():
    return current_user.role == "ADMIN"

@admin_bp.route("/users",methods=["GET"])
@login_required
def get_all_users():
    if not admin_required():
        return jsonify ({"error": "Forbidden,admin only"}),403
    
    search_term = request.args.get("search","").strip()
    query = User.query

    if search_term:
        query = query.filter(
            or_(
                User.first_name.ilike(f"%{search_term}%"),
                User.last_name.ilike(f"%{search_term}%"),
                User.email.ilike(f"%{search_term}%")
            )
        )

    users = query.all()

    result = []
    for u in users:
        result.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "is_blocked": u.is_blocked,
            "role": u.role
        })

    return jsonify({"users": result}),200

@admin_bp.route("/block/<int:user_id>",methods=["POST"])
@login_required
def toggle_block_user(user_id):
    if not admin_required():
        return jsonify ({"error": "Forbidden,admin only!"}),403
    
    user = User.query.get(user_id)

    if not user:
        return jsonify ({"error": "User not found"}),404
    
    if user_id == current_user.id:
        return jsonify ({"error": "You cannot block yourself"}),400
    
    user.is_blocked = not user.is_blocked
    db.session.commit()

    status = "blocked" if user.is_blocked else "unblocked"
    return jsonify ({
        "message": f"User {status}",
        "is_blocked": user.is_blocked
    }),200

@admin_bp.route("/users/<int:user_id>/posts", methods=["GET"])
@login_required
def get_user_posts(user_id):
    if not admin_required():
        return jsonify ({"error": "Forbidden,admin only!"}),403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}),404
    
    posts = Post.query.filter(
        Post.user_id == user_id,
        Post.deleted_at.is_(None)
    ).order_by(Post.created_at.desc()).all()

    result = []

    for p in posts:
        result.append({
            "id": p.id,
            "text": p.text,
            "image": p.image,
            "created_at": p.created_at.isoformat()
        })

    return jsonify ({"posts": result}),200

@admin_bp.route("/users/<int:user_id>/photos", methods=["GET"])
@login_required
def get_user_photos(user_id):
    if not admin_required():
        return jsonify ({"error": "Forbidden,admin only!"}),403
     
    user = User.query.get(user_id)

    if not user:
        return jsonify ({"error": "User not found"}),404
     
    photos = Photo.query.filter(
        Photo.user_id == user_id,
        Photo.deleted_at.is_(None)
    ).order_by(Photo.created_at.desc()).all()

    result = []
    for photo in photos:
        result.append({
            "id": photo.id,
            "image": photo.image,
            "description": photo.description,
            "created_at": photo.created_at.isoformat()
        })
    
    return jsonify ({"photos": result}),200

@admin_bp.route("/post/<int:post_id>", methods=["GET"])
@login_required
def get_post_details(post_id):
    if not admin_required():
        return jsonify ({"error": "Forbidden,admin only!"}),403
    
    post = Post.query.filter(
        Post.id == post_id,
        Post.deleted_at.is_(None)
    ).first()

    if not post:
        return jsonify ({"error": "Post not found or already deleted"}),404
    
    return jsonify({
        "id": post.id,
        "text": post.text,
        "image": post.image,
        "created_at": post.created_at.isoformat(),
        "user_id": post.user_id
    }),200

@admin_bp.route("/photo/<int:photo_id>", methods=["GET"])
@login_required
def get_photo_details(photo_id):
    if not admin_required():
        return jsonify ({"error": "Forbidden,admin only!"}),403
    
    photo = Photo.query.filter(
        Photo.id == photo_id,
        Photo.deleted_at.is_(None)
    ).first()

    if not photo:
        return jsonify ({"error": "Photo not found or already deleted"}),404
    
    return jsonify({
        "id": photo.id,
        "image": photo.image,
        "description": photo.description,
        "created_at": photo.created_at.isoformat(),
        "user_id": photo.user_id
    }),200

@admin_bp.route("/delete-post/<int:post_id>", methods=["DELETE"])
@login_required
def delete_post(post_id):
    if not admin_required():
        return jsonify ({"error": "Forbidden,admin only!"}),403
    
    post = Post.query.filter(
        Post.id == post_id,
        Post.deleted_at.is_(None)
    ).first()

    if not post:
        return jsonify ({"error": "Post not found or already deleted"}),404
    
    data = request.get_json() or {}
    reason = data.get("reason","").strip()

    if not reason:
        return jsonify ({"error": "Reason is required"}),400
    
    post.deleted_at = datetime.utcnow()

    msg = Message(
        sender_id=current_user.id,
        receiver_id=post.user_id,
        content=f"Your post (ID {post.id}) was deleted by administator. Reason: {reason}",
        created_at=datetime.utcnow()
    )

    db.session.add(msg)
    db.session.commit()

    return jsonify({"message": "Post deleted,user notified"}),200

@admin_bp.route("/delete-photo/<int:photo_id>", methods=["DELETE"])
@login_required
def delete_photo(photo_id):
    if not admin_required():
        return jsonify ({"error": "Forbidden,admin only!"}),403
    
    photo = Photo.query.filter(
        Photo.id == photo_id,
        Photo.deleted_at.is_(None)
    ).first()

    if not photo:
        return jsonify ({"error": "Photo not found or already deleted"}),404
    
    data = request.get_json() or {}
    reason = data.get("reason","").strip()

    if not reason:
        return jsonify ({"error": "Reason is required"}),400
    
    photo.deleted_at = datetime.utcnow()

    msg = Message(
        sender_id=current_user.id,
        receiver_id=photo.user_id,
        content=f"Your photo (ID {photo.id}) was deleted by administator. Reason : {reason}",
        created_at=datetime.utcnow()
    )

    db.session.add(msg)
    db.session.commit()

    return jsonify ({"message": "Photo deleted, user notifed"}),200
