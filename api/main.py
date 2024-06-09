from app import app, socketio
import sys
import os
# sys.path.append("..")
if __name__ == "__main__":
    socketio.run(
        app, 
        host='0.0.0.0', 
        port=5000
        , allow_unsafe_werkzeug="True"
    )