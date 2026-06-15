from flask import Blueprint,request,jsonify
from app import db
from app.models.photo import Photo
import os
from werkzeug.utils import secure_filename

photos_bp = Blueprint("photos",__name__,url_prefix="/photo")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER,exist_ok=True)

@photos_bp.route("/",methods=["GET"])
def all_photos():
    photos = Photo.query.order_by(Photo.id.desc()).all()

    result = []
    for photo in photos:
        result.append({
            "id": photo.id,
            "image": photo.image,
            "description": photo.description,
            "user_id": photo.user_id,
            "created_at": photo.created_at
        })
    
    return jsonify(result),200

@photos_bp.route("/upload", methods=["POST"])
def upload_photo():
    if "image" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["image"]
    description = request.form.get("description")
    user_id = request.form.get("user_id")

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    file.save(file_path)

    new_photo = Photo(
        image=file_path,
        description=description,
        user_id=user_id
    )

    db.session.add(new_photo)
    db.session.commit()

    return jsonify({
        "message": "Photo uploaded successfully",
        "photo_id": new_photo.id
    }), 201

@photos_bp.route("/<int:photo_id>",methods=["GET"])
def photo_details(photo_id):
    photo = Photo.query.get(photo_id)

    if not photo:
        return jsonify ({"error" : "Photo not found"}),404
    
    image_url = "http://127.0.0.1:5050/uploads/{}".format(photo.image.split("\\")[-1])
    
    return jsonify ({
        "id" : photo.id,
        "image" : photo.image,
        "description" : photo.description,
        "user_id" : photo.user_id,
        "created_at" : photo.created_at,
        "image_url": image_url
    }),200

@photos_bp.route("/delete/<int:photo_id>", methods=["DELETE"])
def delete_photo(photo_id):
    photo = Photo.query.get(photo_id)

    if not photo:
        return jsonify ({"error" : "Photo not found"}),404
    
    db.session.delete(photo)
    db.session.commit()

    return jsonify ({"message" : "Photo deleted"}),200
