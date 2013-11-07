from flask import Flask, jsonify, Blueprint, request, abort, make_response
from app.questions.models import Question
from app.replies.models import Reply
from app import db
from app.votes.models import QVote,RVote
import datetime
from app.decorators import crossdomain

vmod = Blueprint('votes', __name__, url_prefix='/vote')

##___QUESTIONS________
@vmod.route('/q/', methods = ['POST'])
@vmod.route('/q/<int:qid>/', methods = ['POST'])
@vmod.route('/q/<int:qid>/<upOrDown>', methods = ['POST'])
@crossdomain
#TODO: requires login
def create_vote_question(qid=0,upOrDown=None):
   if not (qid!=0 or (request.json and 'question_id' in request.json)):
      abort(400)
   if qid==0:
      qid=int(request.json['question_id'])
   if not ((upOrDown=="up" or upOrDown=="down") or (request.json and 'value' in request.json)):
      abort(400)
   if upOrDown:
      if upOrDown=="up":
         value=1
      if upOrDown=="down":
         value=-1
   elif not (request.json['value']==1 or request.json['value']==-1):
      abort(400)
   else:
      value=request.json['value']

   r = QVote(value = value, timestamp = datetime.datetime.utcnow(),question_id=qid)
   db.session.add(r)
   db.session.commit()
   return "",200


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
@vmod.route('/r/', methods = ['POST'])
@vmod.route('/r/<int:rid>/', methods = ['POST'])
@vmod.route('/r/<int:rid>/<upOrDown>', methods = ['POST'])
@crossdomain
#TODO: requires login
def create_vote_reply(rid=0,upOrDown=None):
   if not (rid!=0 or (request.json and 'reply_id' in request.json)):
      abort(400)
   if rid==0:
      rid=int(request.json['reply_id'])
   if not ((upOrDown=="up" or upOrDown=="down") or (request.json and 'value' in request.json)):
      abort(400)
   if upOrDown:
      if upOrDown=="up":
         value=1
      if upOrDown=="down":
         value=-1
   elif not (request.json['value']==1 or request.json['value']==-1):
      abort(400)
   else:
      value=request.json['value']

   r = RVote(value = value, timestamp = datetime.datetime.utcnow(),reply_id=rid)
   db.session.add(r)
   db.session.commit()
   return "",200


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
