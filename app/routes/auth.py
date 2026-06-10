from flask import Blueprint, request, jsonify,session
from werkzeug.security import generate_password_hash,check_password_hash
from flask_login import login_user,logout_user
from app import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    gender = (data.get("gender") or "").strip()
    password = data.get("password") or ""
    confirm_password = data.get("confirm_password") or ""

    errors = {}

    if not username:
        errors["username"] = "Username is required"
    
    if not email:
        errors["email"] = "Email is required"

    if not first_name:
        errors["first_name"] = "Frist name is required"

    if not last_name:
        errors["last_name"] = "Last name is required"
    
    if not gender:
        errors["gender"] = "Gender is required"

    if not password:
        errors["password"] = "Password is required"
    elif len(password)< 4 :
        errors["password"] = "Pasword must be at least 4 characters long"

    if not confirm_password:
        errors["confirm_password"] = "Confirm password is requried"
    elif password !=confirm_password:
        errors["confirm_password"] = "Password do not match"

    if errors:
        return jsonify({"errors": errors}),400

    existing_user = User.query.filter(
        (User.username == username) |
        (User.email == email)
    ).first()

    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = generate_password_hash(password)

    user = User(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        gender=gender,
        password=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid email"}), 401

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid password"}), 401

    login_user(user)

    return jsonify({
        "message": "Login successful",
        "user_id": user.id
    })

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    logout_user()

    return jsonify({
        "message": "Successfully logged out"
    }), 200

from app import login_manager
from app.models.user import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))