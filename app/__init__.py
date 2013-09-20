from flask import Flask, jsonify, make_response
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')

db = SQLAlchemy(app)

@app.errorhandler(404)
def not_found(error):
   return make_response(jsonify( {'error':'Not Found'} ), 404)

from questions.views import qmod as QuestionModule
app.register_blueprint(QuestionModule)



