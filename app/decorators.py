from flask import make_response, g, request, abort, session
from app.users.models import User
from app.questions.models import Question
from functools import wraps
from pprint import pprint
import datetime

def crossdomain(func):
   @wraps(func)
   def wrapped_function(*args, **kwargs):
      resp = make_response(func(*args, **kwargs))
      origin = request.environ.get('HTTP_ORIGIN')
      h = resp.headers
      h['Access-Control-Allow-Origin'] = origin
      h['Access-Control-Allow-Methods'] = "GET, POST, PUT, DELETE, OPTIONS"
      h['Access-Control-Max-Age'] = '10000'
      h['Access-Control-Allow-Credentials'] = 'true'
      h['Access-Control-Allow-Headers'] = "accept, origin, authorization, content-type, content-length, connection, x-requested-with, user-agent"
      return resp

   return wrapped_function


def requires_login(f):
   @wraps(f)
   def decorated_function(*args, **kwargs):
      if request.json:
         try:
            session['email']=request.json['email']
            session['token']=request.json['token']
         except:
            pass
      if 'email' and 'token' in session:
         mail=session['email']
         user = User.query.filter_by(email=mail).first()
         time = datetime.datetime.utcnow()
         if user and not user.check_token(session['token']):
            abort(403)
         g.user = user
      else:
            abort(403)
      return f(*args, **kwargs)
   return decorated_function

def requires_author(f):
   @wraps(f)
   def decorated_function(*args,**kwargs):
      if 'email' and 'token' in session:
         user = User.query.filter_by(email=session['email']).first()
         r = [x for x in request.environ.get('PATH_INFO').split('/') if x]
         if r[0] == 'questions':
            q = Question.query.get(r[1])
            if user != q.author:
               abort(403)
            
      return f(*args, **kwargs)
   return decorated_function     
