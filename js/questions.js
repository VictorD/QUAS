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

function getParameterByName(name, hash) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(hash);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// source: https://github.com/knockout/knockout/wiki/Asynchronous-Dependent-Observables
function asyncDependentObservable(evaluator, owner) {
    var result = ko.observableArray();
    
    ko.dependentObservable(function() {
        // Get the $.Deferred value, and then set up a callback so that when it's done,
        // the output is transferred onto our "result" observable
        evaluator.call(owner).done(result);        
    });
    
    return result;
}

var QuestionViewModel = function() {
    var self = this;
    self.viewingID = ko.observable();
    
    self.questionsJSON = asyncDependentObservable(function() {
        // Replace with $.ajax and drop some goody dependant DATA vars here like! 2bootifyl!
        return $.getJSON(window.backendURL + '/questions/');
    }, this);
    
    self.questions = ko.computed(function() {
        return ko.utils.arrayMap(self.questionsJSON().QuestionList, function(item) {
            var newQuestion = new Question(item);
            return newQuestion;
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
    self.afterRenderCallback = self.afterRenderCallback.bind(this);

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

        question.repliesJSON =  asyncDependentObservable(function() {
            // Filter by some other vars if u want
            return $.getJSON(window.backendURL + "/questions/" + qid + "/replies/");
        }, this);

        question.replies = ko.computed(function() {
            return ko.utils.arrayMap(question.repliesJSON().ReplyList, function(reply) {
                return {id:        ko.observable(reply.id), 
                        author:    ko.observable(reply.author),
                        body:      ko.observable(reply.body),
                        timestamp: ko.observable(reply.timestamp)
                       }
            });
        })
    },
    viewQuestion: function(item, event) {
        if (item) {
            id = item.id()
            console.log("Pushing state with id " + id);
            History.pushState({id: id, rnd:Math.random()}, "Viewing Question: " + id, "/?viewingID=" + id);
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
    },
    updateSelection: function() {
        var newID = this.viewingID();

        if (!newID)
            return;
            
        console.log("Updating higlight and updating QuestionView top-offset: " + newID);
        
        var elem = $("#question_" + newID)
        

        $("#questionList li").removeAttr('style');
        elem.css({'background-color': '#b9ecff'});
        
        var position = elem.position();
        console.log("Position: " + position);
        if (position) {
            var offset = position.top + 19;
            $("#questionView").offset({ top: offset});
        }
    },
    afterRenderCallback: function(elements) {
        if (elements.length > 1) {
            console.log(elements);
            this.updateSelection();
        }
    }
});


