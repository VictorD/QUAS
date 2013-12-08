from app import db
from app.votes.models import QVote,RVote
import os, binascii
from datetime import datetime, timedelta

class User(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   username = db.Column(db.String(25))
   description = db.Column(db.String(500))
   email = db.Column(db.String(100))
   votesum = db.Column(db.Integer)
   created_at = db.Column(db.DateTime)
   last_seen = db.Column(db.DateTime)
   avatar = db.Column(db.String())
   token = db.Column(db.String)
   token_expires = db.Column(db.DateTime)
   questions = db.relationship('Question', backref='author')
   replies = db.relationship('Reply', backref='author')

   def to_dict(self):
      return dict(
         id=self.id,
         username=self.username,
         email=self.email,
         token = self.token,
         expires = self.token_expires,
         description=self.description,
         posts=self.posts_eval(),
         avatar=self.avatar,
         votesum=self.vote_eval(),
         created=self.created_at,
         last_seen=self.last_seen,
      )
   

   def refresh_expiretime(self):
      self.token_expires = datetime.utcnow() + timedelta(hours=1)

   def create_token(self):
      self.token = binascii.b2a_hex(os.urandom(25))

   def check_token(self, token):
      return (self.token == token and self.token_expires>datetime.utcnow())

   def posts_eval(self):
      p = len(self.questions) + len(self.replies)
      return p

   def vote_eval(self):
      s1=sum([vote.value for sublist in [q.votes for q in self.questions if q.votes!=[]] for vote in sublist])
      s2=sum([vote.value for sublist in [q.votes for q in self.replies if q.votes!=[]] for vote in sublist])
      return s1+s2

   def author_return(self):
      return dict(
         id = self.id,
         username = self.username,
         posts = self.posts_eval(),
         avatar = self.avatar,
         votesum = self.votesum         
      )

   def __repr__(self):
      return '<User %r>' % (self.id)

