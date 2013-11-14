window.backendURL = 'http://130.240.5.168:5000';

var Question = function(data) {
   this.author    = ko.observable();
   this.id        = ko.observable();
   this.body      = ko.observable("Body placeholder");
   this.title     = ko.observable("Title placeholder");
   this.tags      = ko.observable();
   this.timestamp = ko.observable("undefined time");
   this.replies   = ko.observableArray();

   var self = this;
   this.deleteQuestion = function() {
      var qid = self.id();
      $.ajax({
        url: window.backendURL + '/questions/' + qid + '/',
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
   this.author(data.author)
   this.id(data.id);
   this.body(data.body);
   this.title(data.title);
   this.tags(data.tags);
   this.timestamp(data.timestamp);
   this.replies(data.replies);
};

var QuestionViewModel = function() {
   this.questions      = ko.observableArray();
   this.viewedQuestion = ko.observable();
   this.viewQuestion   = this.viewQuestion.bind(this);

   self = this;
   $.getJSON(window.backendURL + '/questions/').done(function(data) {
      console.log("We are in ajax();");
      var ql = data.QuestionList;
      for (var i = 0; i < ql.length; i++) {
         self.questions.push(new Question(ql[i]));
      }
   });

  // Establish Variables
  var State = History.getState();

  // Bind to State Change
  History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
     var State = History.getState(); // Note: We are using History.getState() instead of event.state
     //History.log('statechange:', State.data, State.title, State.url);
     //History.log('questionId: ', State.data.state);
     self.viewedQuestion(self.getQuestionById(State.data.state)[0]);
  });
};

ko.utils.extend(QuestionViewModel.prototype, {
  isViewingQuestion: function() { 
    return (this.viewedQuestion() != undefined); 
  },
  getQuestionById: function(id) {
    return $.grep(self.questions(), function(q) { return q.id() == id; });
  },
  isQuestionSelected: function(id) {
    return (this.isViewingQuestion() && this.viewedQuestion().id() == id());
  },
  viewQuestion: function(question) {
    var questionId = ko.toJS(question.id);

    question.replies([]);
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

