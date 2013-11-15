#!/usr/bin/env python

from random import choice
import json

def generate():
   tags = ["Physics", "Math", "Gibb", "ComputerScience", "Hockeypulver", "Duschhjalm"]
   tmp = []

   x = choice([1,2,3])
   while len(tmp) < x:
      t = choice(tags)
      if t not in tmp:
         tmp.append(t)
   return tmp

if __name__=="__main__":
   print json.dumps(generate())



