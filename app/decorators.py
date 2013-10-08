from flask import make_response
from functools import wraps

def crossdomain(func):
   @wraps(func)
   def wrapped_function(*args, **kwargs):
      resp = make_response(func(*args, **kwargs))

      h = resp.headers
      h['Access-Control-Allow-Origin'] = '*'
      h['Access-Control-Allow-Methods'] = "GET, POST, PUT, DELETE, OPTIONS"
      h['Access-Control-Max-Age'] = '10000'
      h['Access-Control-Allow-Credentials'] = 'true'
      h['Access-Control-Allow-Headers'] = "accept, origin, authorization, content-type, content-length, connection, x-requested-width, user-agent"
      return resp

   return wrapped_function

