from flask import Flask, jsonify, Blueprint, request, abort
from app.decorators import crossdomain
from models import Tag
from app import db
import datetime

tmod = Blueprint('tags', __name__, url_prefix='/tags')


@tmod.route('/', methods = ['GET'])
@crossdomain
def list_all_tags():
   t_all = Tag.query.all()
   t_all_dict = []
   for t in t_all:
      t_all_dict.append(t.to_dict())

   return jsonify( { 'Tags': t_all_dict } )


def get_tag(tagName):
   tag = db.session.query(Tag).filter(Tag.title==tagName).first()  
   if tag:
      return tag
   else:
      t = Tag(title=tagName)
      db.session.add(t)
      db.session.commit()
      return t
      
