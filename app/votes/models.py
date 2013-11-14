from app import db

class QVote(db.Model):
#TODO USER/AUTHOR
   id = db.Column(db.Integer, primary_key=True)
   value =db.Column(db.Integer) 
   question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
   timestamp = db.Column(db.DateTime)
   question = db.relationship('Question', backref='votes')   
   author_id = db.Column(db.Integer, db.ForeignKey('user.id'))

   def to_dict(self):
      return dict(
         id = self.id,
         value = self.value,
         question_id = self.question_id,
         timestamp = self.timestamp
      )
   
   def __str__(self):
      return str(self.value)
   def __repr__(self):
      return '<Vote %r >' % (self.id)

class RVote(db.Model):
#TODO USER/AUTHOR
   id = db.Column(db.Integer, primary_key=True)
   value =db.Column(db.Integer) 
   reply_id = db.Column(db.Integer, db.ForeignKey('reply.id'), nullable=False)
   timestamp = db.Column(db.DateTime)
   reply = db.relationship('Reply', backref='votes')   
   author_id = db.Column(db.Integer, db.ForeignKey('user.id'))

   def to_dict(self):
      return dict(
         id = self.id,
         value = self.value,
         reply_id = self.reply_id,
         timestamp = self.timestamp
      )
   
   def __str__(self):
      return str(self.value)
   def __repr__(self):
      return '<Vote %r >' % (self.id)



