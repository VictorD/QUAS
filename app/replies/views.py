from flask import Flask, jsonify, Blueprint, request, abort
from models import Reply
from app.decorators import jsonp
from app import db
import datetime

rmod = Blueprint('replies', __name__, url_prefix='/replies')

@rmod.route('/', methods = ['POST'])
@jsonp
#TODO: requires login
def create_reply():   
   if not request.json or not 'body' in request.json:
      abort(400)

   r = Reply(body = request.json['body'], timestamp = datetime.datetime.utcnow(), question_id=int(request.json['question_id']))
   db.session.add(r)
   db.session.commit()
   return jsonify( {'Reply id': r.to_dict()} ), 201


@rmod.route('/', methods = ['GET'])
@jsonp
def get_all_replies():
   all_r = Reply.query.all()
   all_r_dict = []
   for r in all_r:
      all_r_dict.append(r.to_dict())
   return jsonify( {'ReplyList':all_r_dict} )

@rmod.route('/<int:rid>/', methods = ['GET'])
@jsonp
def get_reply(rid):
   r = Reply.query.get(rid)
   if r is None:
      abort(400)
   else:
      rd = r.to_dict()
      return jsonify( {'Reply':rd} )

@rmod.route('/<int:rid>/', methods = ['DELETE'])
@jsonp
def delete_reply(rid):
   r = Reply.query.get(rid)
   if r is None:
      abort(400)
   db.session.delete(r)
   db.session.commit()
   return jsonify( {'Deleted id':rid} )

@rmod.route('/<int:rid>/', methods = ['PUT'])
@jsonp
def modify_reply(rid):
   if not request.json:
      return(400)

   if 'body' in request.json:
      db.session.query(Reply).filter(Reply.id == rid).update({'body':request.json['body']})

   db.session.commit()
   return jsonify( {'Modified id':rid} ), 200
