from app import db, app
from app.questions.models import Question
from app.votes.models import QVote,RVote
from app.replies.models import Reply
import os, binascii
from datetime import datetime, timedelta
import flask.ext.whooshalchemy as whooshalchemy

class User(db.Model):
   __searchable__ = ['username']

   id = db.Column(db.Integer, primary_key=True)
   username = db.Column(db.String(25))
   description = db.Column(db.String(500))
   email = db.Column(db.String(100))
   posts = db.Column(db.Integer)
   votesum = db.Column(db.Integer)
   created_at = db.Column(db.DateTime)
   last_seen = db.Column(db.DateTime)
   token = db.Column(db.String)
   token_expires = db.Column(db.DateTime)
   questions = db.relationship('Question', backref='author')
   replies = db.relationship('Reply', backref='author')
   #votes = db.relationship('Vote', backref='author')
   #votes_id = db.Column(db.Integer, db.ForeignKey('vote.id'))

   def to_dict(self):
      return dict(
         id=self.id,
         username=self.username,
         email=self.email,
         token = self.token,
         expires = self.token_expires,
         description=self.description,
         posts=self.posts,
         votesum=self.votesum,
         created=self.created_at,
         last_seen=self.last_seen
      )

   def refresh_expiretime(self):
      self.token_expires = datetime.utcnow() + timedelta(hours=1)

   def create_token(self):
      self.token = binascii.b2a_hex(os.urandom(25))

   def check_token(self, token):
      return (self.token == token)

   def posts_eval(self):
      qs = Question.query.filter(Question.author_id==self.id)
      rs = Reply.query.filter(Reply.author_id==self.id)
      self.posts = qs.count() + rs.count()
      db.session.commit()

   def vote_eval(self):
      qs = Question.query.filter(Question.author_id==self.id)
      rs = Reply.query.filter(Reply.author_id==self.id)
      #for q in qs:
      #   q.votes

   def author_return(self):
      return dict(
         username = self.username,
         posts = self.posts,
         votesum = self.votesum         
      )

   def __repr__(self):
      return '<User %r>' % (self.id)

whooshalchemy.whoosh_index(app, User)
