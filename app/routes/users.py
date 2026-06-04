from flask import Blueprint,request,jsonify
from app import db
from app.models.user import User

users_bp = Blueprint("users",__name__)

@users_bp.route("/profile/<int:user_id>")
def profile(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error":" User not found!"}),404
    
    return jsonify({
        "id:":user.id,
        "username:" : user.username,
        "email:" : user.email
    })

@users_bp.route("/edit-profile/<int:user_id>",methods=["PUT"])
def edit_profile(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error":" User not found!"}),404
    
    data = request.json

    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]
    
    db.session.commit()

    return jsonify({"messege":"Profile updated"})

@users_bp.route("/search")
def search_users():
    query = request.args.get("q")

    if not query:
        return jsonify({"error":"Missing query parametar"}),400
    
    users = User.query.filter(User.username.ilike(f"%[query]%")).all()

    return jsonify([{
        "id:" : u.id,
        "username:" : u.username,
        "email:" : u.email
    }
    for u in users
    ])
