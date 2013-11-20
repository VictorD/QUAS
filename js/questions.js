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
   this.author(data.author || {username : "unknown"});
   this.id(data.id);
   this.body(data.body);
   this.title(data.title);
   this.tags(data.tags);
   this.timestamp(data.timestamp);
};

// bryt ut i ny .js fil
var qFilter = function(){
	var self = this;
	self.orderby = ko.observable(false);
	self.filtername = ko.observable();
	/*
	
	self.filterTest3 = ko.observable(false);
	*/
	
}
// == 


var QuestionViewModel = function(parent) {
    var self = this;
    self.parent = parent;
    self.viewingID = ko.observable();
    self.questions = ko.observableArray();
	self.qfilter = ko.observable(new qFilter());
	
	ko.computed(function() {
		var x = self.qfilter().orderby();
		self.questions(self.questions.slice(0).reverse())
	});
	
    ko.computed(function() {
      console.log("Loading questions");
	  var tmp = self.qfilter().filtername();
	  var options ={};
	  if (tmp)
		options = {
			filter_by:'author',
			filter_data: tmp
		};

      $.getJSON(window.backendURL + '/questions/', options).success(function(data) {
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
    self.loadReplies        = self.loadReplies.bind(this);

    // Bind to State Change
    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        var qid = getParameterByName('viewingID', State.hash);
        if (qid && qid != '')
            self.viewingID(qid);
    });
};

ko.utils.extend(QuestionViewModel.prototype, {
    findQuestion: function(id) {
        return ko.utils.arrayFirst(this.questions(), function(item) {
            return id == item.id();
        });
    },
    isReplyAuthor: function(reply) {
        return (this.parent.user().id() == reply.author().id());
    },
    isQuestionSelected: function(question) {
        if (this.viewedQuestion() == undefined) {
          return false;
        }
        return this.viewedQuestion.id() == question.id();
    },
    loadReplies: function(question) {
        var qid = question.id();
        var currentUser = this.parent.user();

        question.replies = ko.observableArray();

        ko.computed(function() {
          $.getJSON(window.backendURL + "/questions/" + qid + "/replies/").success(function(data) {
            console.log(data);
            data = data.ReplyList;
            for (var i = data.length - 1; i >= 0; i--)
              var thisReply = new Reply(data[i]);
              console.log(thisReply);

              if (currentUser && thisReply.author())
                thisReply.madeByMe = (thisReply.author().id == currentUser.id());

              question.replies.push(thisReply);

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
        $('#questionView').hide(); 
        $('#questionView').fadeIn(600);
        $('#rightColumn').hide(); 
        $('#rightColumn').fadeIn(600);//('slide', {'direction':'left', 'mode':'show'}, 400); 
    }
    
});



