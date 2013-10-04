from app import db

class Tag(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   title = db.Column(db.String(30))
   
   def to_dict(self):
      return dict(
         id = self.id,
         title = self.title
      )

   
   def __repr__(self):
      return '%s' % (self.title)

tags = db.Table('tags',
   db.Column('tag_id', db.Integer, db.ForeignKey('tag.id')),
   db.Column('question_id', db.Integer, db.ForeignKey('question.id'))
)

