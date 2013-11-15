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
   self.viewingID      = ko.observable();
   self.viewedQuestion = ko.computed(function() {
      var q = self.findQuestion(self.viewingID())

      if (q && typeof q.loading == 'undefined') {
          q.loading = true;
          console.log("Loading replies for question: " + ko.toJS(q).id);
          self.loadReplies(q);
      }
      return q;
   });

   self.viewQuestion       = self.viewQuestion.bind(this);
   self.isQuestionSelected = self.isQuestionSelected.bind(this);
   self.findQuestion       = self.findQuestion.bind(this);
   self.deleteQuestion     = self.deleteQuestion.bind(this);

   $.getJSON(window.backendURL + '/questions/').done(function(data) {
      console.log("We are in ajax();");
      var ql = data.QuestionList;
      for (var i = ql.length-1; i >= 0; i--) {
         self.questions.push(new Question(ql[i]));
      }
   });

  // Bind to State Change
  /*History.Adapter.bind(window,'statechange',function(){
    var State = History.getState();
    console.log('id: ' + self.viewingID());
    console.log('statechange:', State.data, State.title, State.url);
    console.log("question viewed: " + self.viewedQuestion());
  });*/
};

ko.utils.extend(QuestionViewModel.prototype, {
    findQuestion: function(id) {
        return ko.utils.arrayFirst(this.questions(), function(item) {
            return id == item.id();
        });
    },
  isQuestionSelected: function(question) {
    if (this.viewedQuestion() == undefined) {
      return false;
    }

    eq = ko.toJS(this.viewedQuestion).id == ko.toJS(question.id);
    return eq;
  },
  loadReplies: function(question) {
      var qid = ko.toJS(question).id;
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
        delete question.loading;
      });
    },
    viewQuestion: function(id) {
        if (id) {
          id = id()
          History.pushState({}, "Viewing Question: " + id, "?viewingID=" + id);
        }
    },
    deleteQuestion: function(question) {
       this.questions.remove(question);
        var qid = question.id();
        $.ajax({
            url: window.backendURL + '/questions/' + qid + '/',
            type: 'DELETE',
            success: function(result) {
                alert("deleted question " + qid);

            }
        });
    }
});

