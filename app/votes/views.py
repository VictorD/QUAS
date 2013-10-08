from flask import Flask, jsonify, Blueprint, request, abort, make_response
from app.questions.models import Question
from app.replies.models import Reply
from app import db
from app.votes.models import QVote,RVote
import datetime

vmod = Blueprint('votes', __name__, url_prefix='/vote')

##___QUESTIONS________
@vmod.route('/q/', methods = ['POST'])
#TODO: requires login
def create_vote_question():   
   if not request.json or not 'question_id' in request.json or not 'value' in request.json:
      abort(400)
   if not (request.json['value']==1 or request.json['value']==-1):
      abort(400)
   vote_on_question(int(request.json['question_id']),request.json['value'])
   return "",200
##vote on qid
@vmod.route('/q/<int:qid>/', methods = ['POST'])
#TODO: requires login
#TODO: Fix so one user can't vote on same thing multiple times
def vote_on_question(qid,upordown):
   q=Question.query.get(qid)
   r = Vote(value = upordown, timestamp = datetime.datetime.utcnow(), question_id=qid)
   db.session.add(r)
   db.session.commit()
   return "",200
@vmod.route('/q/<int:qid>/up', methods = ['POST'])
#TODO: requires login
def upvote_on_question(qid):
   vote_on_question(qid,1)
   return "",200
@vmod.route('/q/<int:qid>/down', methods = ['POST'])
#TODO: requires login
def downvote_on_question(qid):
   vote_on_question(qid,-1)
   return "",200


##The score of the question with qid
@vmod.route('/q/<int:qid>/', methods = ['GET'])
def score_for_question(qid):
   q=Question.query.get(qid)
   sum=0
   for vote in q.votes:
      sum+=vote.value
   return jsonify({"votes":sum})

##list all the votes related to a question,
##perhaps not very usefull
@vmod.route('/q/<int:qid>/list', methods = ['GET'])
def list_question(qid):
   q=Question.query.get(qid)
   vdict=[]
   for v in q.votes:
     vdict.append(v.to_dict())
   return jsonify({'VoteList':vdict} )





##___REPLIES________
@vmod.route('/r/', methods = ['POST'])
#TODO: requires login
def create_vote_reply():   
   if not request.json or not 'reply_id' in request.json or not 'value' in request.json:
      abort(400)
   if not (request.json['value']==1 or request.json['value']==-1):
      abort(400)
   vote_on_reply(int(request.json['reply_id']),request.json['value'])
   return "",200
##vote on rid
@vmod.route('/r/<int:rid>/', methods = ['POST'])
#TODO: requires login
#TODO: Fix so one user can't vote on same thing multiple times
def vote_on_reply(rid,upordown):
   r = Vote(value = upordown, timestamp = datetime.datetime.utcnow(), reply_id=qid)
   db.session.add(r)
   db.session.commit()
   return "",200
@vmod.route('/r/<int:rid>/up', methods = ['POST'])
#TODO: requires login
def upvote_on_reply(rid):
   vote_on_reply(rid,1)
   return "",200
@vmod.route('/r/<int:rid>/down', methods = ['POST'])
#TODO: requires login
def downvote_on_reply(rid):
   vote_on_reply(rid,-1)
   return "",200


##The score of the reply with rid
@vmod.route('/r/<int:rid>/', methods = ['GET'])
def score_for_reply(rid):
   r=Reply.query.get(rid)
   sum=0
   for vote in r.votes:
      sum+=vote.value
   return jsonify({"votes":sum})

##list all the votes related to a reply,
##perhaps not very usefull
@vmod.route('/r/<int:rid>/list', methods = ['GET'])
def vote_list_replies(rid):
   r=Reply.query.get(rid)
   vdict=[]
   for v in q.votes:
     vdict.append(v.to_dict())
   return jsonify({'VoteList':vdict} )
