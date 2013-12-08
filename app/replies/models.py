from app import db
from sqlalchemy.orm import backref

class Reply(db.Model): 
   id = db.Column(db.Integer, primary_key=True)
   body = db.Column(db.String(500))
   question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
   question = db.relationship('Question', backref=backref('replies', cascade="all,delete"))
   timestamp = db.Column(db.DateTime) 
   author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
   #edited = db.Column(db.DateTime)

   def to_dict(self):
      retdict=dict(
         id = self.id,
         body = self.body,
         author=self.author.author_return(),
         question_id = self.question_id,
         timestamp = self.timestamp,
         score=self.score(),
         #edit=self.edited
      )
      return retdict

   def score(self):
      return sum([x.value for x in self.votes])

   def __repr__(self):
      return '<Reply %r >' % (self.id)

