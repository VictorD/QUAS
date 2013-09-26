from flask import Flask, jsonify, Blueprint, request, abort, make_response
from models import Reply
from app.questions.models import Question
from app import db
import datetime

rmod = Blueprint('replies', __name__, url_prefix='/replies')

@rmod.route('/', methods = ['POST'])
#TODO: requires login
def create_reply():   
   if not request.json or not 'body' in request.json:
      abort(400)

   r = Reply(body = request.json['body'], timestamp = datetime.datetime.utcnow(), question_id=int(request.json['question_id']))
   db.session.add(r)
   db.session.commit()
   return jsonify( {'Reply id': r.to_dict()} ), 201


@rmod.route('/', methods = ['GET'])
def get_all_replies():
   all_r = Reply.query.all()
   all_r_dict = []
   for r in all_r:
      all_r_dict.append(r.to_dict())
   return jsonify( {'ReplyList':all_r_dict} )

@rmod.route('/<int:rid>/', methods = ['GET'])
def get_reply(rid):
   r = Reply.query.get(rid)
   if r is None:
      abort(400)
   else:
      rd = r.to_dict()
      return jsonify( {'Reply':rd} )


