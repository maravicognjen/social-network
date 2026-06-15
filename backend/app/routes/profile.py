from flask import Blueprint,request,jsonify
from flask_login import login_required,current_user
from datetime import datetime
from app import db
from app.models.user import User
from app.models.photo import Photo
from werkzeug.security import check_password_hash,generate_password_hash

profile_bp = Blueprint("profile", __name__)

def safe_str(value):
    return (value or "").strip()

@profile_bp.route("", methods=["GET"])
@login_required
def get_profile():
    user = current_user

    return jsonify({
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "birth_date": user.birth_date.isoformat() if user.birth_date else None,
        "gender": user.gender,
        "profile_image": user.profile_image,
        "is_private": user.is_private
    }),200

@profile_bp.route("", methods=["PUT"])
@login_required
def update_profile():
    data = request.get_json() or {}
    errors = {}

    if "username" in data:
        return jsonify ({"error": "Username cannot be changed"}),400
    
    first_name = safe_str(data.get("first_name"))
    last_name = safe_str(data.get("last_name"))
    email = safe_str(data.get("email"))
    birth_date_str = safe_str(data.get("birth_date"))
    gender = safe_str(data.get("gender"))
    is_private = data.get("is_private")

    if not first_name:
        errors["first_name"] = "First name is required"

    if not last_name:
        errors["last_name"] = "Last name is required"

    if not email:
        errors["email"] = "Email is required"
    elif "@" not in email or "." not in email:
        errors["email"] = "Invalid email format"
    else:
        existing = User.query.filter(
            User.email == email,
            User.id != current_user.id
        ).first()

        if existing:
            errors["email"] = "Email is already in use"

    birth_date = None
    if birth_date_str:
        try:
            birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
        except ValueError:
            errors["birth_date"] = "Invalid date format (YYYY-MM-DD)"

    if gender and gender not in ["MALE", "FEMALE", "OTHER"]:
        errors["gender"] = "Gender must be MALE, FEMALE, or OTHER"

    if errors:
        return jsonify({"errors": errors}), 400
    
    current_user.first_name = first_name
    current_user.last_name = last_name
    current_user.email = email
    current_user.birth_data = birth_date
    current_user.gender = gender if gender else None
    if isinstance(is_private,bool):
        current_user.is_private = is_private

    db.session.commit()

    return jsonify({"message": "Profile successfully updated"}),200

@profile_bp.route("/change-password", methods=["POST"])
@login_required
def change_password():
    data = request.get_json() or {}
    errors = {}

    old_password = data.get("old_password", "")
    new_password = data.get("new_password", "")
    confirm_new = data.get("confirm_new_password", "")

    if not old_password:
        errors["old_password"] = "Current password is required"
    elif not check_password_hash(current_user.password, old_password):
        errors["old_password"] = "Current password is incorrect"

    if not new_password:
        errors["new_password"] = "New password is required"
    elif len(new_password) < 4:
        errors["new_password"] = "New password must be at least 4 characters long"

    if not confirm_new:
        errors["confirm_new_password"] = "Password confirmation is required"
    elif new_password != confirm_new:
        errors["confirm_new_password"] = "Passwords do not match"

    if errors:
        return jsonify({"errors": errors}), 400

    current_user.password = generate_password_hash(new_password)
    
    db.session.commit()

    return jsonify({"message": "Password successfully changed"}),200


@profile_bp.route("/photos", methods=["GET"])
@login_required
def get_user_photos():
    photos = Photo.query.filter(
        Photo.user_id == current_user.id,
        Photo.deleted_at.is_(None)
    ).order_by(Photo.created_at.desc()).all()

    return jsonify({
        "photos": [
            {
                "id": p.id,
                "image": p.image,
                "description": p.description,
                "created_at": p.created_at.isoformat()
            }
            for p in photos
        ]
    }),200

@profile_bp.route("/profile-image", methods=["PUT"])
@login_required
def set_profile_image():
    data = request.get_json() or {}
    photo_id = data.get("photo_id")

    if not photo_id:
        return jsonify({"error": "photo_id is required"}), 400

    photo = Photo.query.filter(
        Photo.id == photo_id,
        Photo.user_id == current_user.id,
        Photo.deleted_at.is_(None)
    ).first()

    if not photo:
        return jsonify({"error": "Photo not found or does not belong to user"}), 404

    current_user.profile_image = photo.image
    db.session.commit()

    return jsonify({
        "message": "Profile image updated successfully",
        "profile_image": photo.image
    }),200
