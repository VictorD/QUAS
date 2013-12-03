
var Question = function(parent, data) {
    var self = this ;
    self.parent    = parent;
    self.author    = ko.observable();
    self.id        = ko.observable();
    self.body      = ko.observable();
    self.title     = ko.observable();
    self.tags      = ko.observable();
    self.vote      = ko.observable();
    self.timestamp = ko.observable();
    self.replies   = ko.observableArray();

    if (data)
        self.update(data);
        
    self.isSelected = ko.computed(function() {
        if (!self.parent || !self.parent.viewingID) return false;

        var vq = self.parent.viewingID();
        if (!vq) return false;

        return (self.parent.viewingID() == self.id());
    });
};

Question.prototype.update = function(data) {
   this.author(data.author || {username : "unknown"});
   this.id(data.id);
   this.body(data.body);
   this.title(data.title);
   this.vote(new Vote(this, data.score));
   this.tags(data.tags);
   this.timestamp(data.timestamp);
};


Question.prototype.submitQuestion = function(question, parent) {
   var data = {
      body: question.body(),
      title: question.title()
   };

   var self = this;
   secureAjaxJSON('http://130.240.5.168:5000' + '/questions/', 'POST', data).done(
      function(response) {
         console.log("Created new question");
         parent.questions.push(new Question(response.Question));
      }
   ); 
}

var Vote = function(question, initValue) {
    var self = this;

    self.voteCast = 0;
    self.question = question;
    self.score = ko.observable(initValue);

    self.upvote = function() {
        if (self.voteCast < 1)
            self.submitVote(1);
    }
    self.downvote = function() { 
        if (self.voteCast > -1) 
            self.submitVote(-1)
    }
    
    self.submitVote = function(v) {
        self.voteCast = v;

        var data = {
          question_id: self.question.id(),
          value: v
        };

        secureAjaxJSON('http://130.240.5.168:5000/vote/q/', 'POST', data).done(
          function(response) {
            self.score(v);
            console.log("YOUR VOTE HAS BEEN CAST.");
          }); 
    }
}

// == 

var QuestionViewModel = function(parent) {
    var self = this;
    self.parent = parent;
    self.backendURL = parent.backendURL;

    self.viewingID = ko.observable(0);
    self.lastViewedID = ko.observable(0);

    self.isViewingQuestion = ko.computed(function() {
        return self.viewingID() > 0;
    });

    self.questions = ko.observableArray();
    
    // SORT questions by votes live
    self.qfilter = ko.observable(new qFilter());

    ko.computed(function() {
        if (self.qfilter().orderByVotes()) {
            var x = self.questions();
            self.questions.sort(function(l,r) {   
                var leftScore  = l.vote().score(),
                    rightScore = r.vote().score(),
                    order = leftScore > rightScore;
                if (leftScore == rightScore) {
                    var leftTime = new Date(l.timestamp.peek()).getTime();
                    var rightTime = new Date(r.timestamp.peek()).getTime();
                    order =  leftTime > rightTime;
                }
                return order ? 1:-1;
            });
        }
    });
    
    ko.computed(function() {
        var x = self.qfilter().orderby();
        self.questions(self.questions().reverse())
    });


    ko.computed(function() {
      console.log("Loading questions");
      var tmp = self.qfilter().filtername();
      var options ={};
      if (tmp)
            options = {
             paginate:1,
                   filter_by:  'author',
                   filter_data: tmp
            };

      $.getJSON(self.backendURL + '/questions/', options).success(function(data) {
        self.questions([]);
        data = data.QuestionList;
        for (var i = data.length - 1; i >= 0; i--) {
          var q = new Question(self, data[i]);
          self.questions.push(q);
        };
      });
    });
    
    self.viewedQuestion = ko.observable();

    // Detect change to viewingID and fetch new question to show!
    ko.computed(function() {
        var newID = self.viewingID();
        if (newID <= 0 || newID == self.lastViewedID())
            return;

        var q = self.findQuestion(newID);
        if (!q) {
            console.log("Error: Question with ID " + newID + " not found");
            return;
        }

        if (self.viewedQuestion())
            console.log("Updating viewed question from " + self.lastViewedID() + " to " + newID);

        if (q.replies().length < 1) {
            console.log("Loading replies for question: " + q.id());
            self.loadReplies(q);
        }

        self.viewedQuestion(q);

        self.lastViewedID(q.id());
    });
	
	self.texFunction = function(){
		console.log("nya funktionen kallas");
		var x = self.viewedQuestion();
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}


    self.viewQuestion       = self.viewQuestion.bind(this);
    self.isReplyAuthor      = self.isReplyAuthor.bind(this);
    self.isQuestionSelected = self.isQuestionSelected.bind(this);
    self.findQuestion       = self.findQuestion.bind(this);
    self.deleteQuestion     = self.deleteQuestion.bind(this);
    self.loadReplies        = self.loadReplies.bind(this);
    self.returnToQuestion   = self.returnToQuestion.bind(this);

    // Bind to State Change
    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        var qid = getParameterByName('viewingID', State.hash);
        if (qid && qid != '' && qid != self.viewingID()) {
            self.viewingID(qid);
            $(document).scrollTop(0);
        }
    });
};

ko.utils.extend(QuestionViewModel.prototype, {
    findQuestion: function(id) {
        return ko.utils.arrayFirst(this.questions.slice(0), function(item) {
            return id == item.id();
        });
    },
    isReplyAuthor: function(reply) {
        var currentUser = this.parent.user();
        return (currentUser && reply && reply.author() && reply.author().id == currentUser.id());
    },
    isQuestionSelected: function(question) {
        return this.viewedQuestion() && this.viewedQuestion.id() == question.id();
    },
    loadReplies: function(question) {
        var self = this;
        ko.computed(function() {
            var qid = question.id();        
            $.getJSON(self.backendURL + "/questions/" + qid + "/replies/").success(function(data) {
                data = data.ReplyList;
                for (var i = data.length - 1; i >= 0; i--) {
                    var thisReply = new Reply(data[i]);
                    thisReply.madeByMe = self.isReplyAuthor(thisReply);
                    question.replies.push(thisReply);
                }
            });
        });
    },
    pushID: function(id) {
        History.pushState({pageName: 'questions', rnd:Math.random()}, "Viewing Question: " + id, "/?viewingID=" + id);
    },
    returnToQuestion: function() {
        this.pushID(this.lastViewedID());
    },
    returnToResults: function() {
        var v = this.viewingID();
        this.lastViewedID(v);
        this.pushID(0);
    },
    viewQuestion: function(item, event) {
        if (item)
            this.pushID(item.id());
    },
    deleteQuestion: function(question) {
        var self = this;
        var qid = question.id();
        secureAjaxJSON(this.backendURL + '/questions/' + qid + '/', 'DELETE').done(function(result) {
            self.questions.remove(question);
        });
    },
    afterRenderCallback: function() { 
		console.log("afterRenderCallback function");
        $('#profileView').fadeOut(600); 
        $('#questionView').hide(); 
        $('#questionView').fadeIn(1200);
        $('#rightColumn').hide(); 
        $('#rightColumn').fadeIn(1200);//('slide', {'direction':'left', 'mode':'show'}, 400); 
    }
    
});



