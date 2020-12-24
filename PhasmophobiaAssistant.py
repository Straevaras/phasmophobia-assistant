#!/usr/bin/python3

from PhasmophobiaAssistant import app
import os

def start():
    app.config.update(
        TEMPLATES_AUTO_RELOAD = True
    )
    app.run()

def startDebug():
    app.config.update(
        DEBUG = True,
        TEMPLATES_AUTO_RELOAD = True
    )
    app.run(debug=True)

if __name__ == "__main__":
    if os.getenv("FLASK_DEBUG", False):
        startDebug()
    else:
        start()