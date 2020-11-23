from app import app

def start():
    app.config.update(
        DEBUG = True,
        TEMPLATES_AUTO_RELOAD = True
    )
    app.run(debug=True)

if __name__ == "__main__":
    start()