from app import create_app
from app import db

app = create_app()

@app.route("/")
def home():
    return "Social Network API radi!"

if __name__ == "__main__":
    app.run(debug=True, port=5050)