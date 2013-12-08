from flask import Flask, jsonify, make_response, send_from_directory, render_template
import os
basedir = os.path.abspath(os.path.dirname(__file__))
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.openid import OpenID

app = Flask(__name__)
app.config.from_object('config')

db = SQLAlchemy(app)
oid = OpenID(app, basedir)

@app.errorhandler(404)
def not_found(error):
   return make_response(jsonify( {'error':'Not Found'} ), 404)

@app.errorhandler(403)
def bad_request(error):
   return make_response(jsonify( {'error':'Forbidden'} ), 403)

@app.errorhandler(400)
def bad_request(error):
   return make_response(jsonify( {'error':'Bad Request'} ), 400)

@app.route('/favicon.ico')
def favicon():
   return send_from_directory(basedir, 'favicon.ico')

@app.route('/api')
def api_doc():
   return render_template('api.html')

@app.route('/')
def index():
   return jsonify ( {'Index':'Welcome to QUAS backend! To see API documention go to /api'} )



from questions.views import qmod as QuestionModule
app.register_blueprint(QuestionModule)

from replies.views import rmod as ReplyModule
app.register_blueprint(ReplyModule)

from tags.views import tmod as TagModule
app.register_blueprint(TagModule)

from votes.views import vmod as VotesModule
app.register_blueprint(VotesModule)

from users.views import umod as UsersModule
app.register_blueprint(UsersModule)

from search.views import smod as SearchModule
app.register_blueprint(SearchModule)

