#!/usr/bin/env python

from random import choice

def generate():
   PRE = ["All","The","An","Some","Any","No"]
   ADJ = ["green", "big", "biggest", "strange", "unique", "focused", "subscription based","dreamy"]
   MAIN = ["rock", "stranger", "danger", "ranger", "pringles", "lemon pie", "hedgehog", "conversation", "meme", "Obama", "paper"]
   BND = ["on a", "with a", "against the", "covering", "opposite to", "behind a","under a"]
   SND = ["bus", "bathtub", "forklift", "bicyle", "bridge", "housekeeper"]
   END = [".", "!", "!!!", "..."]

   reply = choice(PRE) + " " + choice(ADJ) + " " + choice(MAIN) + " " + choice(BND) + " " + choice(SND) + choice(END)



if __name__=="__main__":
   print generate()
