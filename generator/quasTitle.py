#!/usr/bin/env python

from random import choice

def generate():
   PRE = ["Why","How","Where","What"]
   ADJ = ["green", "big", "biggest", "strange", "unique", "focused", "subscription based"]
   MAIN = ["rock", "stranger", "danger", "ranger", "pringles", "lemon pie", "determined", "conversation", "explosion"]
   BND = ["on a", "with a", "against the", "covering"]
   SND = ["spoon", "toaster", "ball", "banana", "wall", "backflip"]
   END = ["?", "!?"]

   title = choice(PRE) + " " + choice(ADJ) + " " + choice(MAIN) + " " + choice(BND) + " " + choice(SND) + choice(END)
   return title

if __name__=="__main__":
   print generate()


