from flask import Blueprint,request,jsonify
from app import db
from app.models.post import Post

posts_bp = Blueprint("posts",__name__,url_prefix="/posts")

@posts_bp.route("/",methods=["GET"])
def all_posts():
    posts = Post.query.order_by(Post.id.desc()).all()

    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "text" : post.text,
            "image" : post.image,
            "user_id" : post.user_id,
            "created_at": post.created_at

        })
    return jsonify(result), 200


@posts_bp.route("/create",methods=["POST"])
def create_post():
    data = request.get_json()
    text  = data.get("text")
    image = data.get("image")
    user_id = data.get("user_id")

    if not text or not user_id:
        return jsonify({"error":"text and user_id are required"}),400
    
    new_post = Post(
       text = text,
       image = image,
       user_id = user_id
   )
    
    db.session.add(new_post)
    db.session.commit()

    return jsonify({
        "message": "Post created" , 
        "post_id" : new_post.id
    }),201

@posts_bp.route("/<int:post_id>", methods=["GET"])
def get_post(post_id):
    post = Post.query.get(post_id)

    if not post:
        return jsonify({"error": "Post not found"}),404
    
    return jsonify({
        "id" : post.id,
        "text" : post.text,
        "image" : post.image,
        "user_id" : post.user_id,
        "created_at" : post.created_at
    }),200


@posts_bp.route("/delete/<int:post_id>",methods=["DELETE"])
def delete_post(post_id):
    post = Post.query.get(post_id)

    if not post:
        return jsonify({"error" : "Post not found"}),404
    
    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Post deleted"}),200
