from app import db, app
import flask.ext.whooshalchemy as whooshalchemy

class Reply(db.Model):
   __searchable__ = ['body']
   
   id = db.Column(db.Integer, primary_key=True)
   body = db.Column(db.String(500))
   question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
   question = db.relationship('Question', backref='replies')
   timestamp = db.Column(db.DateTime)
   author_id = db.Column(db.Integer, db.ForeignKey('user.id'))

   def to_dict(self):
      return dict(
         id = self.id,
         body = self.body,
         author=self.author.author_return(),
         question_id = self.question_id,
         timestamp = self.timestamp
      )
   
   def __repr__(self):
      return '<Reply %r >' % (self.id)

whooshalchemy.whoosh_index(app, Reply)
