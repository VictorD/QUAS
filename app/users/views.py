from models import User
from flask import Flask, jsonify, Blueprint, request, abort, g, session, redirect
from app.decorators import crossdomain, requires_login
from app import db, oid
import datetime, json
from pprint import pprint

umod = Blueprint('users', __name__, url_prefix='/u')

@umod.route('/<int:qid>/', methods = ['OPTIONS'])
@umod.route('/', methods = ['OPTIONS'])
@umod.route('/me/', methods = ['OPTIONS'])
@umod.route('/amiloggedin/', methods = ['OPTIONS'])
@umod.route('/logout', methods = ['OPTIONS'])
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

@umod.route('/me/', methods = ['GET'])
@requires_login
@crossdomain
def get_self():
   user=User.query.filter_by(email=session['email']).first()
   if user is not None:
      return jsonify({'User':user.to_dict()})
   abort(403)

@umod.route('/amiloggedin/', methods = ['GET'])
@crossdomain
def check_login_statusP():
   if loggedIn():
      return jsonify({'Status':True})
   return jsonify({'Status':False})

def loggedIn():
   if 'email' and 'token' in session:
      mail = session['email']
      user = User.query.filter_by(email=mail).first()
      if user and user.check_token(session['token']):
         return True
   return False

@umod.route('/<int:id>/', methods = ['PUT'])
@crossdomain
def update_user(id):
   pprint(request.json)
   u = User.query.get(id)
   if 'username' in request.json:
      u.username = request.json['username']
   if 'description' in request.json:
      u.description = request.json['description']
   if 'avatar' in request.json:
      u.avatar = request.json['avatar']
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
   if 'email' in session:
      user = User.query.filter_by(email=session['email']).first()
      if user and user.check_token(session['token']):
         return redirect(request.environ.get('HTTP_REFERER'))

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
      username = session['email'].split('@')[0]
      user = User(username=username,description='', votesum=0, created_at=datetime.datetime.utcnow(), last_seen=datetime.datetime.utcnow(), email=resp.email, avatar='https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=100')
      db.session.add(user)
      msg = 'Created User'

   user.create_token()
   user.refresh_expiretime()
   user.last_seen = datetime.datetime.utcnow()
   session['token'] = user.token
   db.session.commit()
   return redirect(request.args.get('next'))

#@umod.before_request
#def before_request():
#   g.user = None
#   if 'email' and 'token' in session:
#      g.user = User.query.filter_by(email=session['email']).first()

