from app import db

class Vote(db.Model):
#TODO USER/AUTHOR
   id = db.Column(db.Integer, primary_key=True)
   value =db.Column(db.Integer) 
   question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
   question = db.relationship('Question', backref='votes')
   timestamp = db.Column(db.DateTime)

   def to_dict(self):
      return dict(
         id = self.id,
         value = self.value,
         question_id = self.question_id,
         timestamp = self.timestamp
      )
   
   def __repr__(self):
      return '<Vote %r >' % (self.id)
