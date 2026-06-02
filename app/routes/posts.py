from flask import Blueprint

posts_bp = Blueprint("posts",__name__)

@posts_bp.route("/")
def all_posts():
    return "All posts"

@posts_bp.route("/create")
def create_post():
    return "Create post"

@posts_bp.route("/<int:post_id>")
def post_details(post_id):
    return f"Post {post_id}"

@posts_bp.route("/delete/<int:post_id>")
def delete_post(post_id):
    return f"Delete post {post_id}"
