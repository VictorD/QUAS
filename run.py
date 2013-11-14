#!flask/bin/python
from tornado.wsgi import WSGIContainer
import tornado.httpserver
import tornado.ioloop
from tornado.autoreload import start as restarter
from tornado.web import FallbackHandler, RequestHandler, Application
import tornado.options
from app import app

class MainHandler(RequestHandler):
   def get(self):
      self.write("Starting tornado server...")

tr = WSGIContainer(app)
tornado.options.parse_command_line()

application = Application([
(r"/tornado", MainHandler),
(r".*", FallbackHandler, dict(fallback=tr)),
])

if __name__ == "__main__":
   application.listen(5000)
   loop = tornado.ioloop.IOLoop.instance()
   restarter(loop)
   loop.start()

