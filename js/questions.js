window.backendURL = 'http://130.240.5.168:5000';

var Question = function(data) {
   this.author    = ko.observable();
   this.id        = ko.observable();
   this.body      = ko.observable("Body placeholder");
   this.title     = ko.observable("Title placeholder");
   this.tags      = ko.observable();
   this.timestamp = ko.observable("undefined time");
   this.replies   = ko.observableArray();
  
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
   var self = this;
   self.questions      = ko.observableArray();
   self.viewedQuestion = ko.observable();
   self.viewQuestion   = self.viewQuestion.bind(this);

   $.getJSON(window.backendURL + '/questions/').done(function(data) {
      console.log("We are in ajax();");
      var ql = data.QuestionList;
      for (var i = 0; i < ql.length; i++) {
         self.questions.push(new Question(ql[i]));
      }
   });

  // Bind to State Change
  History.Adapter.bind(window,'statechange',function(){
    var State = History.getState();

    console.log('statechange:', State.data, State.title, State.url);
    currentQuestion = State.data.question;
    if (currentQuestion) {      
      self.viewedQuestion(currentQuestion);
    }
  });
};

ko.utils.extend(QuestionViewModel.prototype, {
  isViewingQuestion: function() { 
    return (ko.toJS(this.viewedQuestion) != undefined); 
  },
  getQuestionById: function(id) {
    return $.grep(ko.toJS(this.questions), function(q) { return q.id == id; });
  },
  isQuestionSelected: function(question) {
    return this.isViewingQuestion() && (ko.toJS(this.viewedQuestion).id == question.id);
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

    History.pushState({question:ko.toJS(question), rnd:Math.random()}, "Viewing Question: " + questionId, "?question=" + questionId);
  },
  deleteQuestion: function(question) {
    var qid = question.id;
    $.ajax({
      url: window.backendURL + '/questions/' + qid + '/',
      type: 'DELETE',
      success: function(result) {
          alert("deleted question " + qid);
      }
    });
  }
});

