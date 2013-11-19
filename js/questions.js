window.backendURL = 'http://130.240.5.168:5000';

var Question = function(data) {
   this.author    = ko.observable();
   this.id        = ko.observable();
   this.body      = ko.observable("Body placeholder");
   this.title     = ko.observable("Title placeholder");
   this.tags      = ko.observable();
   this.timestamp = ko.observable("undefined time");

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
    self.viewingID = ko.observable();
    self.questions = ko.observableArray();

    ko.computed(function() {
      console.log("Loading questions");
      $.getJSON(window.backendURL + '/questions/').success(function(data) {
        data = data.QuestionList;
        for (var i = data.length - 1; i >= 0; i--) {
                  self.questions.push(new Question(data[i]));
        };
      });
    });

    self.viewedQuestion = ko.computed(function() {
        var newID = self.viewingID();

        var q = self.findQuestion(newID);
        if (q) {
            console.log("Updating viewed question");
            console.log("Loading replies for question: " + q.id());
            self.loadReplies(q);
            self.updateSelection();
        }

        return q;
    });

    self.viewQuestion       = self.viewQuestion.bind(this);
    self.isQuestionSelected = self.isQuestionSelected.bind(this);
    self.findQuestion       = self.findQuestion.bind(this);
    self.deleteQuestion     = self.deleteQuestion.bind(this);
    self.updateSelection    = self.updateSelection.bind(this);


    // Bind to State Change
    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        var qid = getParameterByName('viewingID', State.hash);
        if (qid && qid != '')
            self.viewingID(qid);
        console.log(State);
    });
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
        return this.viewedQuestion.id() == question.id();
    },
    loadReplies: function(question) {
        var qid = question.id();
        question.replies = ko.observableArray();

        ko.computed(function() {
          $.getJSON(window.backendURL + "/questions/" + qid + "/replies/").success(function(data) {
            data = data.ReplyList;
            for (var i = data.length - 1; i >= 0; i--) {
              var reply = data[i];
              question.replies.push({
                  id:        ko.observable(reply.id), 
                  author:    ko.observable(reply.author),
                  body:      ko.observable(reply.body),
                  timestamp: ko.observable(reply.timestamp)
                });
            };
          });
        });
    },
    viewQuestion: function(item, event) {
        if (item) {
            id = item.id()
            console.log("Pushing state with id " + id);
            History.pushState({pageName: 'questions', rnd:Math.random()}, "Viewing Question: " + id, "/?viewingID=" + id);
        }
    },
    deleteQuestion: function(question) {
        this.questions.remove(question);
        var qid = question.id();
        $.ajax({
            url: window.backendURL + '/questions/' + qid + '/',
            type: 'DELETE',
            success: function(result) {
                //alert("deleted question " + qid);
                reloadquestion
            }
        });
    },
    updateSelection: function() {
        var newID = this.viewingID();

        if (!newID)
            return;
            
        console.log("Updating higlight and updating QuestionView top-offset: " + newID);
        $("#questionList li").removeAttr('style');

        var elem = $("#question_" + newID)
        elem.css({'background-color': '#b9ecff'});
        
        var position = elem.position();
        console.log("Position: " + position);
        if (position) {
            var offset = position.top + 19;
            var viewBox = $("#questionView");
            viewBox.offset({ top: offset});
            viewBox.hide();
            viewBox.effect('slide', {'direction':'left', 'mode':'show'}, 400);
            
        }
    },
    afterRenderCallback: function() { 
        $('#questionView').hide(); 
        $('#questionView').fadeIn(600);
        $('#rightColumn').hide(); 
        $('#rightColumn').fadeIn(600);//('slide', {'direction':'left', 'mode':'show'}, 400); 
    }
});


