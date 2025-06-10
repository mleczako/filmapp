from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from app.models.chat import film_chat  

recommend_bp = Blueprint('recommend', __name__)

CORS(recommend_bp, resources={r"/chat": {"origins": "http://localhost:3000"}})


@recommend_bp.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    data = request.json
    user_input = data.get("message")
    history = data.get("history", [])

    try:
        reply, updated_history = film_chat(user_input, history)
        return jsonify({
            "reply": reply,
            "history": updated_history
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "reply": "Wystąpił błąd, spróbuj ponownie.",
            "history": history
        }), 500

if __name__ == "__main__":
    recommend_bp.run(debug=True)
