from models import User
from flask import Flask, jsonify, Blueprint, request, abort, g, session, redirect
from app.decorators import crossdomain, requires_login
from app import db, oid
import datetime
from pprint import pprint

umod = Blueprint('users', __name__, url_prefix='/u')

@umod.route('/<int:qid>/', methods = ['OPTIONS'])
@umod.route('/', methods = ['OPTIONS'])
@crossdomain
def tellThemEverythingWillBeOk(qid=0):
   return jsonify ( {'Allowed Methods':''} ), 200

@umod.route('/', methods = ['GET'])
@crossdomain
#@requires_login
def get_users():
   us = User.query.all()
   usdict = []
   for u in us:
      usdict.append(u.to_dict())
   return jsonify( {'UserList':usdict} )


@umod.route('/<int:id>/', methods = ['GET'])
@crossdomain
def get_user(id):
   u = User.query.get(id)
   if u:
      return jsonify({'User':u.to_dict()})
   abort(400)


@umod.route('/<int:id>/', methods = ['PUT'])
@crossdomain
def update_user(id):
   u = User.query.get(id)
   if 'username' in request.json:
      u.username = request.json['username']
   if 'description' in request.json:
      u.description = request.json['description']
   db.session.commit()  
   return jsonify({'User': u.to_dict()})
      

@umod.route('/<int:id>/q/')
@crossdomain
def get_user_questions(id):
   u = User.query.get(id)
   uq = u.questions
   uq_dict = []
   for q in uq:
      uq_dict.append(q.to_dict())
   return jsonify ( {'QuestionList': uq_dict} )

@umod.route('/login', methods = ['GET','POST'])
@oid.loginhandler
@crossdomain
def login():
   if g.user is not None:
      return jsonify({'Login':'Already logged in'})

   if request.method == 'GET':
      return oid.try_login('https://www.google.com/accounts/o8/id', ask_for=['email'])

   return jsonify({'Login':'Failed'})

@umod.route('/logout')
@crossdomain
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
   next = request.args.get('next')+'?user='+str(user.id)
   return redirect(next)

@umod.before_request
def before_request():
   g.user = None
   if 'email' and 'token' in session:
      g.user = User.query.filter_by(email=session['email']).first()

