from flask import Blueprint

messages_bp = Blueprint("messages",__name__)

@messages_bp.route("/")
def conversations():
    return "Messages"

@messages_bp.route("/<int:user_id>")
def coversation(user_id):
    return f"converastion with {user_id}"

@messages_bp.route("/send")
def send_message():
    return "Send message"
