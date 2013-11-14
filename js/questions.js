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
   this.author(data.author ? data.author : "unknown");
   this.id(data.id);
   this.body(data.body);
   this.title(data.title);
   this.tags(data.tags);
   this.timestamp(data.timestamp);
};

var QuestionViewModel = function() {
   var self = this;
   self.questions      = ko.observableArray();
   self.viewedQuestion = ko.observable();
   self.viewQuestion       = self.viewQuestion.bind(this);
   self.isQuestionSelected = self.isQuestionSelected.bind(this);

   $.getJSON(window.backendURL + '/questions/').done(function(data) {
      console.log("We are in ajax();");
      var ql = data.QuestionList;
      for (var i = ql.length-1; i >= 0; i--) {
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
  isQuestionSelected: function(question) {
    if (this.viewedQuestion() == undefined) {
      return false;
    }

    eq = ko.toJS(this.viewedQuestion).id == ko.toJS(question.id);
    return eq;
  },
  loadReplies: function(question) {
      var qid = ko.toJS(question).id;
      console.log("Loading replies for question: " + qid);
      
      question.replies.removeAll();
      $.getJSON(window.backendURL + "/questions/" + qid + "/replies/").done(function(data) {
         var rl = data.ReplyList;
         for (var i = 0; i < rl.length; i++) {
          question.replies.push({				
            id:        ko.observable(rl[i].id),
            author:    ko.observable(rl[i].author),
            body:      ko.observable(rl[i].body),
            timestamp: ko.observable(rl[i].timestamp)
          });
         }
         
         History.replaceState({question:ko.toJS(question), rnd:Math.random()}, "Viewing Question: " + qid, "?question=" + qid);
      });
    },
    viewQuestion: function(question) {
        var qid = ko.toJS(question.id);
        if (question.replies().length == 0) {
            this.loadReplies(question);
        }
        History.pushState({question:ko.toJS(question), rnd:Math.random()}, "Viewing Question: " + qid, "?question=" + qid);
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

