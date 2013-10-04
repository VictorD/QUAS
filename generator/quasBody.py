#!/usr/bin/env python

from random import choice

PRE = ["Why","How","Where","What"]
ADJ = ["green", "big", "biggest", "strange", "unique", "focused", "subscription based"]
MAIN = ["rock", "stranger", "danger", "ranger", "pringles", "lemon pie", "determined", "Conversation", "Power Overwhelming"]
BND = ["on a", "with a", "against the", "covering"]
SND = ["spoon", "toaster", "rage against the machine", "wall", "asdf?"]
END = ["?", "!?"]

body = choice(ADJ) + " " + choice(MAIN) + " " + choice(BND) + " " + choice(SND) + choice(END)

print body
