from flask import Blueprint,request,jsonify
from flask_login import login_required,current_user
from datetime import datetime
from sqlalchemy import or_, and_, func, desc, case
from app import db
from app.models.message import Message
from app.models.user import User

messages_bp = Blueprint("messages",__name__)

@messages_bp.route("/conversations",methods=["GET"])
@login_required
def get_conversations():
    other_user_id=case(
        (Message.sender_id == current_user.id,Message.receiver_id),
        else_= Message.sender_id
    ).label("other_user_id")

    subquery = db.session.query(
        other_user_id,
        func.max(Message.created_at).label("last_msg_time")
    ).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    ).group_by(other_user_id).subquery()

    coversations = db.session.query(
        User.id,
        User.username,
        User.first_name,
        User.last_name,
        User.profile_image,
        User.role,
        subquery.c.last_msg_time
    ).join(
        subquery,
        User.id == subquery.c.other_user_id
    ).order_by(
        desc(subquery.c.last_msg_time)
    ).all()

    result = []

    for c in coversations:
        result.append({
            "user_id": c.id,
            "username": c.username,
            "first_name": c.first_name,
            "last_name": c.last_name,
            "profile_image": c.profile_image,
            "role": c.role,
            "last_message_time": c.last_msg_time.isoformat() if c.last_msg_time else None
        })

    return jsonify({"conversations": result}),200

@messages_bp.route("/<int:user_id>",methods=["GET"])
@login_required
def get_messages(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"errror": "User does not exist"}),404
    
    messages = Message.query.filter(
        or_(
            and_(Message.sender_id == current_user.id,Message.receiver_id == user_id),
            and_(Message.sender_id == user_id,Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at.asc()).all()

    result = []

    for m in messages:
        result.append({
            "id": m.id,
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "content": m.content,
            "created_at": m.created_at.isoformat(),
            "is_admin_message": m.is_admin_message
        })

    return jsonify({"messages": result}),200

@messages_bp.route("/send",methods=["POST"])
@login_required
def send_message():
    data = request.get_json()
    receiver_id = data.get("receiver_id")
    content = data.get("content")

    if receiver_id == current_user.id:
        return jsonify({"error": "You can't send a message to yourself."}), 400

    if not receiver_id or not content:
        return jsonify ({"error": "Missing data"}),400
    
    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify ({"error": "Receiver does not exist"}),400
    
    is_admin = (current_user.role == "ADMIN")

    message = Message(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=content,
        created_at=datetime.utcnow(),
        is_admin_message=is_admin
    )

    db.session.add(message)
    db.session.commit()

    return jsonify({"message": "Message sent"}),201
