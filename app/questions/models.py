from app import db
from app.tags.models import tags

class Question(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   title = db.Column(db.String(50))
   body = db.Column(db.String(500))
   timestamp = db.Column(db.DateTime)
   author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
   tags = db.relationship('Tag', secondary=tags, backref=db.backref('questions', lazy='dynamic'))
   
   def to_dict(self):
      tag_list = []
      for t in self.tags:
         tag_list.append(t.title)
      return dict(
         id=self.id,
         title=self.title,
         body=self.body,
         #author=self.author.author_return(),
         timestamp=self.timestamp,
         tags = tag_list
      )

   def __repr__(self):
      return '<Question %r>' % (self.id)
