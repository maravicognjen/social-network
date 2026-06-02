from flask import Blueprint

users_bp = Blueprint("users",__name__)

@users_bp.route("/profile/<int:user_id>")
def profile(user_id):
    return f"Profile {user_id}"

@users_bp.route("/edit-profile")
def edit_profile():
    return "Edit profile"

@users_bp.route("/search")
def search_users():
    return "Search users"
