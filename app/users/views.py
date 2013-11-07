from models import User
from flask import Flask, jsonify, Blueprint, request, abort, g, session
from app.decorators import crossdomain, requires_login
from app import db, oid
import datetime, pprint
from werkzeug import check_password_hash, generate_password_hash

umod = Blueprint('users', __name__, url_prefix='/u')

@umod.route('/', methods = ['GET'])
def get_users():
   us = User.query.all()
   usdict = []
   for u in us:
      usdict.append(u.to_dict())
   return jsonify( {'UserList':usdict} ) 

@umod.route('/<int:id>/', methods = ['GET'])
def get_user(id):
   u = User.query.get(id)
   if u:
      return jsonify({'User':u.to_dict()})
   abort(400) 

@umod.route('/login', methods = ['GET','POST'])
@oid.loginhandler
def login():
   if g.user is not None:
      return jsonify({'Login':'Already logged in'})

   if request.method == 'GET':
      return oid.try_login('https://www.google.com/accounts/o8/id', ask_for=['email'])

   return jsonify({'Login':'Failed'})

@umod.route('/logout')
def logout():
   session.pop('email', None)
   session.pop('token', None)
   return jsonify({'Logout':'Successful'}), 200

@oid.after_login
def create_or_login(resp):
   session['email'] = resp.email
   user = User.query.filter_by(email=resp.email).first()
   msg = 'Successful'

   if not user:
      user = User(username='',description='', votesum=0, created_at=datetime.datetime.utcnow(), last_seen=datetime.datetime.utcnow(), email=resp.email)
      db.session.add(user)
      msg = 'Created User'

   user.create_token()
   user.refresh_expiretime()
   user.last_seen = datetime.datetime.utcnow()
   session['token'] = user.token
   db.session.commit()
   g.user = user
   return jsonify({'Login': msg}), 200

@umod.before_request
def before_request():
   g.user = None
   if 'email' and 'token' in session:
      g.user = User.query.filter_by(email=session['email']).first()

