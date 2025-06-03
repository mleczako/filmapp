from flask import Blueprint, request, jsonify
from app import db, bcrypt
from app.models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({"error": "Username i password są wymagane"}), 400
        
        username = data.get('username')
        password = data.get('password')
        
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"error": "Użytkownik już istnieje"}), 409
        
        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, password=hashed_pw)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"message": "Rejestracja zakończona sukcesem!"}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Błąd podczas rejestracji"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"error": "Username i password są wymagane"}), 400
        
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return jsonify({
                "message": "Zalogowano pomyślnie", 
                "user": {"id": user.id, "username": user.username}
            }), 200
        
        return jsonify({"error": "Nieprawidłowe dane logowania"}), 401
        
    except Exception as e:
        return jsonify({"error": "Błąd podczas logowania"}), 500