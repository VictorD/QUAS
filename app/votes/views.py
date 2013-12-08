from flask import Flask, jsonify, Blueprint, request, abort, make_response, session
from app.questions.models import Question
from app.users.models import User
from app.replies.models import Reply
from app import db
from app.votes.models import QVote,RVote
import datetime
from app.decorators import crossdomain,requires_login

vmod = Blueprint('votes', __name__, url_prefix='/vote')

@vmod.route('/r/', methods = ['OPTIONS'])
@vmod.route('/q/', methods = ['OPTIONS'])
@crossdomain
def tellThemEverythingWillBeOk():
   return jsonify ( {'Allowed Methods':''} ), 200

##___QUESTIONS________
##works as put or post
@vmod.route('/q/', methods = ['POST','PUT'])
@crossdomain
@requires_login
def create_vote_question():
   user = User.query.filter_by(email=session['email']).first()
   if not (request.json and 'question_id' in request.json):
      abort(400)
   qid=int(request.json['question_id'])
   if not (request.json and 'value' in request.json):  
      abort(400)
   if not (request.json['value']==1 or request.json['value']==-1 or request.json['value']==0):
      abort(400)
   value=request.json['value']
   already = db.session.query(QVote).filter_by(question_id=qid,author_id=user.id).first()
   if not already:
      already = QVote(value = value, timestamp = datetime.datetime.utcnow(),question_id=qid,author_id=user.id)
      db.session.add(already)
   already.value=value
   
   db.session.commit()
   new_score=db.session.query(Question).filter_by(id=qid).first().score()
   return jsonify({"question_id":qid,"score":new_score}),200

##The score of the question with qid
@vmod.route('/q/<int:qid>/', methods = ['GET'])
@crossdomain
def score_for_question(qid):
   q=Question.query.get(qid)
   sum=0
   for vote in q.votes:
      sum+=vote.value
   return jsonify({"votes":sum})

##list all the votes related to a question,
##perhaps not very usefull
@vmod.route('/q/<int:qid>/list', methods = ['GET'])
@crossdomain
def list_question(qid):
   q=Question.query.get(qid)
   vdict=[]
   for v in q.votes:
     vdict.append(v.to_dict())
   return jsonify({'VoteList':vdict} )

##___REPLIES________
@vmod.route('/r/', methods = ['POST','PUT'])
@crossdomain
@requires_login
def create_vote_reply():
   u = User.query.filter_by(email=session['email']).first()
   if not (request.json and 'reply_id' in request.json):
      abort(400)
   rid=int(request.json['reply_id'])
   if not (request.json and 'value' in request.json):
      abort(400)
   if not (request.json['value']==1 or request.json['value']==-1 or request.json['value']==0):
      abort(400)
   value=request.json['value']

   already = db.session.query(RVote).filter_by(reply_id=rid,author_id=u.id).first()
   if not already:
      already = RVote(value = value, timestamp = datetime.datetime.utcnow(),reply_id=rid,author_id=u.id)
      db.session.add(already)
      db.session.commit()
   else:
      already.value=value
   db.session.commit()
   new_score=db.session.query(Reply).filter_by(id=rid).first().score()
   return jsonify({"reply_id":rid,"score":new_score}),200


##The score of the reply with rid
@vmod.route('/r/<int:rid>/', methods = ['GET'])
@crossdomain
def score_for_reply(rid):
   r=Reply.query.get(rid)
   sum=0
   for vote in r.votes:
      sum+=vote.value
   return jsonify({"votes":sum})

##list all the votes related to a reply,
##perhaps not very usefull
@vmod.route('/r/<int:rid>/list', methods = ['GET'])
@crossdomain
def vote_list_replies(rid):
   r=Reply.query.get(rid)
   vdict=[]
   for v in r.votes:
     vdict.append(v.to_dict())
   return jsonify({'VoteList':vdict} )
