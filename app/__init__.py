from flask import Flask, jsonify, make_response
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')

db = SQLAlchemy(app)

@app.errorhandler(404)
def not_found(error):
   return make_response(jsonify( {'error':'Not Found'} ), 404)

@app.errorhandler(400)
def bad_request(error):
   return make_response(jsonify( {'error':'Bad Request'} ), 400)

from questions.views import qmod as QuestionModule
app.register_blueprint(QuestionModule)

from replies.views import rmod as ReplyModule
app.register_blueprint(ReplyModule)
