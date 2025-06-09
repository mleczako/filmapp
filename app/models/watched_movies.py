from .. import db

class WatchedMovie(db.Model):
    __tablename__ = 'watched_movies'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Float)
