from flask import Flask, jsonify, Blueprint, request, abort, session, g
from models import Question
from app.tags.models import Tag
from app.users.models import User
from app.decorators import crossdomain, requires_login, requires_author
from app import db
import datetime, math
from app.tags.views import get_tag
from pprint import pprint

qmod = Blueprint('questions', __name__, url_prefix='/questions')

@qmod.route('/<int:qid>/', methods = ['OPTIONS'])
@qmod.route('/', methods = ['OPTIONS'])
@crossdomain
def tellThemEverythingWillBeOk(qid=0):
   return jsonify ( {'Allowed Methods':''} ), 200

@qmod.route('/', methods = ['GET'])
@crossdomain
def get_questions():
   if 'paginate' in request.args:
      page_size=int(request.args.get('page_size', 10))
      page=int(request.args.get('page', 1))
      order_by=request.args.get('order_by', 'date')
      filter_by=request.args.get('filter_by', '')
      filter_data=request.args.get('filter_data','')
      asc = int(request.args.get('asc', '0'))
   
      qs = 'Question.query'
      qs_dict = []

      sort_by = ''
      if asc:
         sort_by = '.asc()'
      else:
         sort_by = '.desc()'      
      
      if filter_by == 'author':
         u = User.query.filter(User.username.contains(filter_data)).first()
         if u:
            qs += '.filter(Question.author_id=='+str(u.id)+')'

            if order_by == 'name':   
               qs += '.order_by(Question.title'+sort_by+')'
         
            elif order_by == 'vote':
               qs += '.order_by(Question.score'+sort_by+')'
     
            else:
               qs += '.order_by(Question.timestamp'+sort_by+')'

         else:
            return jsonify( {'QuestionList': '', 'Pages': 0} )
      
      elif filter_by == 'tags':
         qs += '.filter(Question.tags.any(Tag.title == filter_data))'
      
      else:
         if order_by == 'name':   
            qs += '.order_by(Question.title'+sort_by+')'
         
         elif order_by == 'vote':       
            qs += '.order_by(Question.score'+sort_by+')'
     
         else:
            qs += '.order_by(Question.timestamp'+sort_by+')'

      qs += '.paginate(page,page_size,False)'
      qs = eval(qs)
      for q in qs.items:
         qs_dict.append(q.to_dict())
      return jsonify( {'QuestionList': qs_dict, 'Pages':int(math.ceil(float(qs.total)/page_size))} )
      
   else: 
      all_q = Question.query.all()
      all_q_dict = []
      tag_dict = []
      for q in all_q:   
         all_q_dict.append(q.to_dict(exclude_body=True))
      return jsonify( {'QuestionList':all_q_dict} )

@qmod.route('/<int:qid>/', methods = ['GET'])
@crossdomain
def get_question(qid):
   q = Question.query.get(qid)
   if q is not None:   
      q_dict = q.to_dict()
      r_list = q.replies
      r_dict = []
      for r in r_list:
         r_dict.append(r.to_dict())
      return jsonify( {'Question': q_dict, 'ReplyList' : r_dict} )
   else:
      abort(404)
      
@qmod.route('/', methods = ['POST'])
@crossdomain
@requires_login
def create_question():
   if not request.json or not 'title' in request.json or not 'body' in request.json:
      abort(400)
   u = User.query.filter_by(email=session['email']).first()
   q = Question(title=request.json['title'].title(), body=request.json['body'], timestamp=datetime.datetime.utcnow(), author_id=u.id)

   if request.json.get('tags'):
      tagList = request.json['tags']
      for tagName in tagList:
         t = get_tag(tagName)
         q.tags.append(t)

   db.session.add(q)
   db.session.commit()
   q_dict = q.to_dict()
   return jsonify( {'Question': q_dict} ), 201

@qmod.route('/<int:qid>/', methods = ['DELETE'])
@crossdomain
@requires_author
def delete_question(qid):
   q = Question.query.get(qid)
   if q is None:
      abort(400)
   db.session.delete(q)
   db.session.commit()
   return jsonify( {'Deleted id': qid} ), 200

@qmod.route('/<int:qid>/', methods = ['PUT'])
@crossdomain
@requires_author
def modify_question(qid):
   if not request.json:
      return(400)
   
   now=datetime.datetime.utcnow()

   if 'title' in request.json:
      db.session.query(Question).filter(Question.id == qid).update({'title':request.json['title'].title()})
      #db.session.query(Question).filter(Question.id == qid).update({'title':request.json['title'],edited=now})
   if 'body' in request.json:
      db.session.query(Question).filter(Question.id == qid).update({'body':request.json['body']})
      #db.session.query(Question).filter(Question.id == qid).update({'body':request.json['body'],edited=now})

   if 'tags' in request.json:
      q = Question.query.get(qid)
      tagList = request.json['tags']
      q.tags = []
      for tagName in tagList:
         t = get_tag(tagName)
         q.tags.append(t)
   
   db.session.commit()
   return jsonify( {'Modified id':qid} ), 200

@qmod.route('/<int:qid>/replies/', methods = ['GET'])
@crossdomain
def get_question_replies(qid):
   reply_list = Question.query.get(qid).replies
   reply_dict = []
   for r in reply_list:
      reply_dict.append(r.to_dict())

   return jsonify( {'ReplyList':reply_dict} )

@qmod.route('/<tagName>/', methods = ['GET'])
@crossdomain
def get_tagged_questions(tagName):
   qs = db.session.query(Question).filter(Question.tags.any(Tag.title == tagName)).all()
   qs_dict = []
   if not qs:
      abort(400)
   else:
      for q in qs:
         qs_dict.append(q.to_dict())

   return jsonify( {'QuestionList': qs_dict } )

