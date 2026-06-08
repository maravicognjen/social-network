from flask import Blueprint,request,jsonify
from flask_login import login_required,current_user
from datetime import datetime
from sqlalchemy import and_, or_
from app import db
from app.models.user import User
from app.models.friend_request import FriendRequest

friends_bp = Blueprint("friends",__name__)

@friends_bp.route("/list", methods=["GET"])
@login_required
def friend_list():

    friendships = FriendRequest.query.filter(
        and_(
            FriendRequest.status == "ACCEPTED",
            or_(
                FriendRequest.sender_id == current_user.id,
                FriendRequest.receiver_id == current_user.id
            )
        )
    ).all()

    friends = []

    for req in friendships:

        friend_id = (
            req.receiver_id
            if req.sender_id == current_user.id
            else req.sender_id
        )

        friend = User.query.get(friend_id)

        if friend:
            friends.append({
                "id": friend.id,
                "username": friend.username,
                "first_name": friend.first_name,
                "last_name": friend.last_name,
                "profile_image": friend.profile_image,
                "email": friend.email
            })

    return jsonify({"friends": friends}), 200

@friends_bp.route("/request_send/<int:receiver_id>",methods=["POST"])
@login_required
def send_friend_request(receiver_id):

    if receiver_id == current_user.id:
        return jsonify({"error": "You can not send yourself rquest"}),400
    
    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify({"error": "User do not exist!"}),404
    
    existing = FriendRequest.query.filter(
        or_(
            and_(
                FriendRequest.sender_id == current_user.id,
                FriendRequest.receiver_id == receiver_id
            ),
            and_(
                FriendRequest.sender_id == receiver_id,
                FriendRequest.receiver_id == current_user.id
            )
        ),
        FriendRequest.status != "REJECTED"
    ).first()

    if existing:
        if existing.status == "PENDING":
            return jsonify ({"error" : "Friend request is already send"}),409
        elif existing.status == "ACCEPTED":
            return jsonify ({"error" : "Already friends"}),409
    
    new_request = FriendRequest(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        status="PENDING",
        created_at=datetime.utcnow()
    )

    db.session.add(new_request)
    db.session.commit()

    return jsonify ({"message" : "Friend request send!"}),201

@friends_bp.route("/pending_requests", methods=["GET"])
@login_required
def pending_requests():
    request = FriendRequest.query.filter_by(
        receiver_id = current_user.id,
        status = "PENDING"
    ).all()

    result = []
    for req in request:
        sender = User.query.get(req.sender_id)
        result.append({
            "request_id": req.id,
            "sender_id": sender.id,
            "sender_username": sender.username,
            "sender_first_name": sender.first_name,
            "sender_last_name": sender.last_name,
            "created_at": req.created_at.isoformat()
        })
    return jsonify ({"pending_requests" : result}),200


   

@friends_bp.route("/accept_request/<int:request_id>",methods=["POST"])
@login_required
def accept_friend_request(request_id):
    friend_request = FriendRequest.query.get(request_id)
    if not friend_request:
        return jsonify({"error": "Request does not exist"}),404
    if friend_request.receiver_id != current_user.id:
        return jsonify ({"error" : "You are not receiver of this request"}),403
    if friend_request.status != "PENDING":
        return jsonify ({"error" : "Request is no longer on waiting list"}),409
    
    friend_request.status = "ACCEPTED"
    db.session.commit()

    return jsonify ({"message": "Firendship accepted"}),200

@friends_bp.route("/reject_request/<int:request_id>",methods=["POST"])
@login_required
def reject_friend_request(request_id):
    friend_request = FriendRequest.query.get(request_id)
    if not friend_request:
        return jsonify({"error": "Request does not exist"}),404
    
    if friend_request.receiver_id != current_user.id:
        return jsonify ({"error": "You are not receiver of this request"}),403
    
    if friend_request.status != "PENDING":
        return jsonify ({"error": "Request is no longer on waiting list"}),409
    
    friend_request.status = "REJECTED"
    db.session.commit()

    return jsonify ({"message" : "Request rejected"}),200
    


