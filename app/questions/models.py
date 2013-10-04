from app import db
from app.tags.models import tags

class Question(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   title = db.Column(db.String(50))
   body = db.Column(db.String(500))
   timestamp = db.Column(db.DateTime)
   tags = db.relationship('Tag', secondary=tags, backref=db.backref('questions', lazy='dynamic'))

   #TODO User author and tags list

   def to_dict(self):
      return dict(
         id=self.id,
         title=self.title,
         body=self.body,
         timestamp=self.timestamp,
         tags = str(self.tags)
      )

   def __repr__(self):
      return '<Question %r>' % (self.id)
