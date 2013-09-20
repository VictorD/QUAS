form app import db

class Question(db.Model):
   id = db.Column(db.Integer, primary_key=True)
   title = db.Column(db.String(50))
   body = db.Column(db.String(500))
   timestamp = db.Coloumn(db.DateTime)
   #TODO User author and tags list

   def __repr__(self):
      return '<Question %r>' % (self.body)
