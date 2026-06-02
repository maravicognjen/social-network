from flask import Blueprint

friends_bp = Blueprint("friends",__name__)

@friends_bp.route("/")
def friends_list():
    return "Friends list"

@friends_bp.route("/request/<int:user_id>")
def send_request(user_id):
    return f"Friend request to {user_id}"

@friends_bp.route("/accept/<int:request_id>")
def accept_request(request_id):
    return f"Accept {request_id}"

@friends_bp.route("/reject/<int:request_id>")
def reject_request(requset_id):
    return f"Reject {requset_id}"

