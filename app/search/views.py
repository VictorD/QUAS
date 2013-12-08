from flask import Flask, jsonify, Blueprint, request, abort, make_response
from app.questions.models import Question
from app.replies.models import Reply
from app.users.models import User
from app.tags.models import Tag
from app import db
from app.decorators import crossdomain,requires_login
from sqlalchemy import or_

smod = Blueprint('search', __name__, url_prefix='/search')

@smod.route('/', methods = ['GET'])
@crossdomain
def search():
   s = request.args.get('search',"")
   s="%"+s+"%"
   search_result = {}

   exclude_user      =   request.args.get('exclude_user', False)
   exclude_question  =   request.args.get('exclude_question', False)
   exclude_reply     =   request.args.get('exclude_reply', False)
   exclude_tag       =   request.args.get('exclude_tag', False) 


   if not exclude_user:
      us = User.query.filter(User.username.ilike(s)).all()
      ulist=[]         
      for u in us:
         ulist.append(u.author_return())
      search_result['UserList'] = ulist

   if not exclude_question:
      qs = Question.query.filter(or_(Question.title.ilike(s),Question.body.ilike(s) ) ).all()
      qlist=[]
      for q in qs:
         qlist.append(q.to_dict())
      search_result['QuestionList'] = qlist

   if not exclude_reply:
      rs = Reply.query.filter(Reply.body.ilike(s)).all()
      rlist=[]
      for r in rs:
         rlist.append(r.to_dict())
      search_result['ReplyList'] = rlist  

   if not exclude_tag:
      ts = Tag.query.filter(Tag.title.ilike(s)).all()
      tlist=[]
      for t in ts:
         tlist.append(t.to_dict())
      search_result['TagList'] = tlist

   return jsonify( { 'Search Result' : search_result } )



