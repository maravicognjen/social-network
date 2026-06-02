from flask import Blueprint, request, jsonify
from extensions import db
from models import User

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.json

    user = User(
        username=data["username"],
        email=data["email"],
        password=data["password"],
        first_name=data.get("first_name")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201