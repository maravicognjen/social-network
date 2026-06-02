from flask import Blueprint

admin_bp = Blueprint("admin",__name__)

@admin_bp.route("/users")
def users():
    return "All users"

@admin_bp.route("/block/<int:user_id>")
def block_user(user_id):
    return f"Block user {user_id}"

admin_bp.route("/delete-post/<int:post_id")
def delete_post(post_id):
    return f"Delete post {post_id}"