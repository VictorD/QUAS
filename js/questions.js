
var Question = function(data) {
   this.author    = ko.observable();
   this.id        = ko.observable();
   this.body      = ko.observable("Body placeholder");
   this.title     = ko.observable("Title placeholder");
   this.tags      = ko.observable();
   this.vote      = ko.observable(new Vote());
   this.timestamp = ko.observable("undefined time");

   if (data)
        this.update(data);
};

Question.prototype.update = function(data) {
   this.author(data.author || {username : "unknown"});
   this.id(data.id);
   this.body(data.body);
   this.title(data.title);
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

// bryt ut i ny .js fil
var qFilter = function(){
	var self = this;
	self.orderby = ko.observable(false);
	self.filtername = ko.observable();
    self.orderByVotes = ko.observable(true);
	
	/*
	
	self.filterTest3 = ko.observable(false);
	*/
	
}

var Vote = function() {
    var self = this;
    self.currentScore = ko.observable(0);
    self.add = function() { self.currentScore(self.currentScore()+1)}
    self.sub = function() { self.currentScore(self.currentScore()-1)}
}
// == 

var QuestionViewModel = function(parent) {
    var self = this;
    self.backendURL = parent.backendURL;
    self.parent = parent;
    self.viewingID = ko.observable();
    self.lastViewedID = ko.observable();
    
    self.questions = ko.observableArray();
	  self.qfilter = ko.observable(new qFilter());

    // SORT questions by votes live
    ko.computed(function() {
        if (self.qfilter().orderByVotes()) {
            var x = self.questions();
            self.questions.sort(function(l,r) {   
                var leftScore  = l.vote().currentScore(),
                    rightScore = r.vote().currentScore(),
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
          self.questions.push(new Question(data[i]));
        };
      });
    });
    
    self.viewedQuestion = ko.observable();
    
    ko.computed(function() {
        var newID = self.viewingID();
        var q = self.findQuestion(newID);
        if (!q || (self.viewedQuestion() && self.viewedQuestion().id() == q.id()))
            return;

        if (self.viewedQuestion())
            console.log("Updating viewed question: " + q.id() + " vs " + self.viewedQuestion().id());
        
        if (!q.replies) {
            console.log("Loading replies for question: " + q.id());
            self.loadReplies(q);
        }
        self.updateSelection();
        self.viewedQuestion(q);
    });

    self.viewQuestion       = self.viewQuestion.bind(this);
    self.isReplyAuthor      = self.isReplyAuthor.bind(this);
    self.isQuestionSelected = self.isQuestionSelected.bind(this);
    self.findQuestion       = self.findQuestion.bind(this);
    self.deleteQuestion     = self.deleteQuestion.bind(this);
    self.updateSelection    = self.updateSelection.bind(this);
    self.loadReplies        = self.loadReplies.bind(this);

    // Bind to State Change
    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        var qid = getParameterByName('viewingID', State.hash);
        if (qid && qid != '' && qid != self.viewingID()) {
            self.viewingID(qid);
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
        question.replies = ko.observableArray();
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
    viewQuestion: function(item, event) {
        if (item) {
            id = item.id()
            History.pushState({pageName: 'questions', rnd:Math.random()}, "Viewing Question: " + id, "/?viewingID=" + id);
        }
    },
    deleteQuestion: function(question) {
        var self = this;
        var qid = question.id();
        secureAjaxJSON(this.backendURL + '/questions/' + qid + '/', 'DELETE').done(function(result) {
            self.questions.remove(question);
        });
    },
    updateSelection: function() {
        var newID = this.viewingID();
        if (!newID)
            return;
            
        $("#questionList li").removeAttr('style');

        var elem = $("#question_" + newID)
        elem.css({'background-color': '#b9ecff'});
        
        var position = elem.position();
        if (position) {
            var offset = position.top + 19;
            var viewBox = $("#questionView");
			viewBox.offset({ top: offset});
            viewBox.hide();
            viewBox.effect('slide', {'direction':'left', 'mode':'show'}, 400);
            
        }
    },
    afterRenderCallback: function() { 
        $('#profileView').fadeOut(600); 
        $('#questionView').hide(); 
        $('#questionView').fadeIn(1200);
        $('#rightColumn').hide(); 
        $('#rightColumn').fadeIn(1200);//('slide', {'direction':'left', 'mode':'show'}, 400); 
    }
    
});



