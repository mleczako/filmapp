from flask import Blueprint, request, jsonify
#from models import WatchedMovie
from app.models.watched_movies import WatchedMovie
from app import db
from flask import Response
import csv
from io import StringIO

watched_bp = Blueprint('watched', __name__, url_prefix="/api/watched")

@watched_bp.route("/", methods=["GET"])
def get_watched():
    user_id = request.args.get("user_id")
    movies = db.session.query(WatchedMovie).filter_by(user_id=user_id).all()
    return jsonify([{"id": m.id, "title": m.title, "rating": m.rating} for m in movies])

@watched_bp.route("/", methods=["POST"])
def add_watched():
    data = request.get_json()
    title = data.get("title")
    rating = data.get("rating")
    user_id = data.get("user_id")

    if not title or rating is None or not user_id:
        return jsonify({"error": "Brakuje danych"}), 400

    movie = WatchedMovie(title=title, rating=rating, user_id=user_id)
    db.session.add(movie)
    db.session.commit()
    return jsonify({
    "message": "Film dodany",
    "movie": {
        "id": movie.id,
        "title": movie.title,
        "rating": movie.rating
    }
}), 201

@watched_bp.route('/<int:movie_id>', methods=['PUT'])
def update_rating(movie_id):
    data = request.get_json()
    movie = db.session.query(WatchedMovie).get(movie_id)
    if movie:
        movie.rating = data.get("rating", movie.rating)
        db.session.commit()
        return jsonify({"message": "Ocena zaktualizowana"}), 200
    return jsonify({"error": "Film nie znaleziony"}), 404

@watched_bp.route('/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    movie = db.session.query(WatchedMovie).get(movie_id)
    if movie:
        db.session.delete(movie)
        db.session.commit()
        return jsonify({"message": "Film usunięty"}), 200
    return jsonify({"error": "Film nie znaleziony"}), 404

@watched_bp.route("/export", methods=["GET"])
def export_watched_movies():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Brak user_id"}), 400

    movies = db.session.query(WatchedMovie).filter_by(user_id=user_id).all()
    si = StringIO()
    cw = csv.writer(si)
    cw.writerow(['Tytuł', 'Ocena'])

    for movie in movies:
        cw.writerow([movie.title, movie.rating])

    output = si.getvalue()
    si.close()

    return Response(
        output,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment;filename=watched_movies.csv'}
    )
