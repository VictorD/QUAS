from flask import make_response
from functools import wraps

def crossdomain(func)
    @wraps(func)
    def wrapped_function(*args, **kwargs):
         resp = make_response(func(*args, **kwargs))

         h = resp.headers
         h['Access-Control-Allow-Origin'] = 'http://www.student.ltu.se'
         h['Access-Control-Allow-Methods'] = "GET, POST, PUT, DELETE"
         h['Access-Control-Max-Age'] = '10000'
         h['Access-Control-Allow-Credentials'] = 'true'
         h['Access-Control-Allow-Headers'] = \
             "Origin, X-Requested-With, Content-Type, Accept, Authorization"
         return resp

     return wrapped_function

