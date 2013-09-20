from flask import Flask, jsonify, Blueprint, request, abort, make_response
from app import db

qmod = Blueprint('questions', __name__, url_prefix='/questions')


@qmod.route('/', methods = ['GET'])
def get_questions():
   return make_response(jsonify( {'Fuck':'Bitches'} ))

#@qmod.route('/', methods = ['POST'])
#TODO: requires login
#def create_question():
#   if not request.json
#      abort(400)
   

