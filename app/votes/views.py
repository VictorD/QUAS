from flask import Flask, jsonify, Blueprint, request, abort, make_response
from models import Reply
from app.questions.models import Question
from app import db
import datetime

vmod = Blueprint('votes', __name__, url_prefix='/vote')

@vmod.route('/', methods = ['POST'])
#TODO: requires login
def create_vote():   
   if not request.json or not 'qid' in request.json:
      abort(400)
   r = Reply(body = request.json['body'], timestamp = datetime.datetime.utcnow(), question_id=int(request.json['question_id']))
   db.session.add(r)
   db.session.commit()
   return jsonify( {'Reply id': r.to_dict()} ), 201


