from app import create_app
from app import db

from app.models.user import User
from app.models.post import Post
from app.models.photo import Photo
from app.models.comment import Comment
from app.models.message import Message
from app.models.friend_request import FriendRequest

app = create_app()

with app.app_context():
    db.create_all()



@app.route("/")
def home():
    return "Social Network API radi!"

if __name__ == "__main__":
    app.run(debug=True, port=5050)