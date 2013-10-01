from flask import Flask, jsonify, Blueprint, request, abort, make_response
from models import Question
from app.decorators import jsonp
#from app.replies.models import Reply
from app import db
import datetime

qmod = Blueprint('questions', __name__, url_prefix='/questions')

@qmod.route('/', methods = ['GET'])
@jsonp
def get_all_questions():
   all_q = Question.query.all()
   all_q_dict = []
   for q in all_q:
      all_q_dict.append(q.to_dict())
   return jsonify( {'QuestionList':all_q_dict} )


@qmod.route('/<int:qid>/', methods = ['GET'])
@jsonp
def get_questions(qid):
   q = Question.query.get(qid)
   if q is not None:   
      q_dict = q.to_dict()
      return jsonify( {'Question': q_dict} )
   else:
      abort(404)
      
@qmod.route('/', methods = ['POST'])
@jsonp
#TODO: requires login
def create_question():
   if not request.json or not 'title' in request.json or not 'body' in request.json:
      abort(400)
   
   q = Question(title=request.json['title'], body=request.json['body'], timestamp=datetime.datetime.utcnow())
   db.session.add(q)
   db.session.commit()
   q_dict = q.to_dict()
   return jsonify( {'Question': q_dict} ), 201

@qmod.route('/<int:qid>/', methods = ['DELETE'])
@jsonp
#TODO: require author or admin
def delete_question(qid):
   q = Question.query.get(qid)
   if q is None:
      abort(400)
   db.session.delete(q)
   db.session.commit()
   return jsonify( {'Deleted id': qid} ), 200

@qmod.route('/<int:qid>/', methods = ['PUT'])
@jsonp
#TODO: require author or admin
def modify_question(qid):
   if not request.json:
      return(400)

   if 'title' in request.json:
      db.session.query(Question).filter(Question.id == qid).update({'title':request.json['title']})

   if 'body' in request.json:
      db.session.query(Question).filter(Question.id == qid).update({'body':request.json['body']})

   db.session.commit()
   return jsonify( {'Modified id':qid} ), 200

@qmod.route('/<int:qid>/replies/', methods = ['GET'])
@jsonp
def get_question_replies(qid):
   reply_list = Question.query.get(qid).replies
   reply_dict = []
   for r in reply_list:
      reply_dict.append(r.to_dict())

   return jsonify( {'ReplyToID':qid,'ReplyList':reply_dict} )

