window.backendURL = 'http://130.240.5.168:5000';

var Question = function(data) {
   this.id        = ko.observable();
   this.body      = ko.observable("Loading question...");
   this.title     = ko.observable("Title placeholder");
   this.tags      = ko.observable();
   this.timestamp = ko.observable("undefined time");
   this.replies   = ko.observableArray();

   var self = this;
   this.deleteQuestion = function() {
      var qid = self.id();
      $.ajax({
        url: 'http://130.240.5.168:5000/questions/' + qid + '/',
        type: 'DELETE',
        success: function(result) {
            // Do something with the result
            alert("deleted question " + qid);
        }
      });
    }
   this.update(data);
};

Question.prototype.update = function(data) {
   this.id(data.id);
   this.body(data.body);
   this.title(data.title);
   this.tags(data.tags);
   this.timestamp(data.timestamp);
   this.replies(data.replies);
};

var QuestionViewModel = function() {
   this.questions = ko.observableArray();
   this.isViewingQuestion = function() { return (questionViewModel.viewedQuestion() != undefined); }
   this.viewedQuestion = ko.observable();
   this.viewQuestion = this.viewQuestion.bind(this);

   /*for (var i=0;i<5;i++)
   { 
      var q = {id:i, body: "look at that body", title: "Is this dummy question #" + i + "?", tags: "#demo #2013 #notreallyaquestion", timestamp: 'timestamp 2013'};
      this.questions.push(new Question(q));
   }*/

   self = this;
   $.getJSON(window.backendURL + '/questions/').done(function(data) {
      console.log("We are in ajax();");
      var ql = data.QuestionList;
      for (var i = 0; i < ql.length; i++) {
         self.questions.push(new Question(ql[i]));
      }
   });

    
};

ko.utils.extend(QuestionViewModel.prototype, {
   viewQuestion: function(question) {
      var questionId = ko.toJS(question.id);
   
      question.replies([]);
      //question.replies.push({body: 'random reply', id: Math.random(), timestamp: "TIMESTAMP"});
      $.getJSON(window.backendURL + "/questions/" + questionId + "/replies/").done(function(data) {
         question.replies([]);
         console.log("Loading replies for question: " + questionId);
         var rl = data.ReplyList;
         for (var i = 0; i < rl.length; i++) {
            question.replies.push({				
            body: ko.observable(rl[i].body),
            id: ko.observable(rl[i].id),
            timestamp: ko.observable(rl[i].timestamp)
           });
         } 
      });

      History.pushState({state:questionId, rnd:Math.random()}, null, "?question=" + questionId);
   }
});

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        $(element).hide();
         
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    },
    update: function(element, valueAccessor) {
        $(element).hide();
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

function getQuestionById(id) {
   return $.grep(questionViewModel.questions(), function(q) { return q.id() == id; });
}

function isQuestionSelected(id) {
   return (questionViewModel.viewedQuestion() != undefined && 
		questionViewModel.viewedQuestion().id() == id());
}

// Establish Variables
var State = History.getState();
var questionViewModel = new QuestionViewModel();

// Bind to State Change
History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
   var State = History.getState(); // Note: We are using History.getState() instead of event.state
   //History.log('statechange:', State.data, State.title, State.url);
   //History.log('questionId: ', State.data.state);

   questionViewModel.viewedQuestion(getQuestionById(State.data.state)[0]);
});


