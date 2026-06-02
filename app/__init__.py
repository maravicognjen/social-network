from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.posts import posts_bp
    from app.routes.photos import photos_bp
    from app.routes.friends import friends_bp
    from app.routes.messages import messages_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp,url_prefix="/auth")
    app.register_blueprint(users_bp,url_prefix="/users")
    app.register_blueprint(posts_bp,url_prefix="/posts")
    app.register_blueprint(photos_bp,url_prefix="/photos")
    app.register_blueprint(friends_bp,url_prefix="/friends")
    app.register_blueprint(messages_bp,url_prefix="/messages")
    app.register_blueprint(admin_bp,url_prefix="/admin")


    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:Krofna123.@localhost:5432/social_network"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    return app