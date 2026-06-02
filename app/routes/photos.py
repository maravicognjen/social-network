from flask import Blueprint

photos_bp = Blueprint("photos",__name__)

@photos_bp.route("/")
def all_photos():
    return "All photos"

@photos_bp.route("/upload")
def upload_photos():
    return "Upload photo"

@photos_bp.route("/<int:photo_id>")
def photo_details(photo_id):
    return f"photo {photo_id}"

@photos_bp.route("/delete/<int:photo_id>")
def delete_photo(photo_id):
    return f"Delete photo{photo_id}"
