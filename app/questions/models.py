from app import db
from app.tags.models import tags
from flask import session

class Question(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   title = db.Column(db.String(50))
   body = db.Column(db.String(500))
   timestamp = db.Column(db.DateTime)
   author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
   tags = db.relationship('Tag', secondary=tags, backref=db.backref('questions', lazy='dynamic'))
   score = db.Column(db.Integer)
   #edited = db.Column(db.DateTime)

   def to_dict(self, exclude_body=False):
      
      tag_list = []
      for t in self.tags:
         tag_list.append(t.title)
      
      retdict =dict(
         id=self.id,
         title=self.title,
         author=self.author.author_return(),
         timestamp=self.timestamp,
         tags = tag_list,
         score=self.score(),
         #edit=self.edited
         )
      if not exclude_body:
         retdict['body'] = self.body
      return retdict

   def score(self):
      self.score = sum([x.value for x in self.votes])
      db.session.commit()
      return self.score

   def __repr__(self):
      return '<Question %r>' % (self.id)

