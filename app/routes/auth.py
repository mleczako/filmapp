from flask import Blueprint, render_template, request, redirect, flash, url_for
from app import db, bcrypt
from app.models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash("Użytkownik już istnieje.")
            return redirect(url_for('auth.register'))

        new_user = User(username=username, password=hashed_pw)
        db.session.add(new_user)
        db.session.commit()
        flash("Rejestracja zakończona sukcesem!")
        return redirect(url_for('auth.register'))

    return render_template("register.html")
