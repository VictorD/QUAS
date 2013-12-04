function arrayFromJSON(data, headerName, objName) {
    var arr = []
    var lst = data[headerName];
    if (lst) {
        for (var i = lst.length - 1; i >= 0; i--) {
            arr.push(new objName(lst[i]));
        }
    }
    return arr;
}

 /*
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
    });*/
    
    /*
    ko.computed(function() {
        var x = self.qfilter().orderby();
        self.questions(self.questions().reverse())
    });*/

function getFilterOptions() {
    /*
    var tmp = self.qfilter().filtername();
        var options ={};
        if (tmp) {
            options = {
             paginate:1,
                   filter_by:  'author',
                   filter_data: tmp
            };
        }
    */
    return {};
}

var QuestionViewModel = function(parent) {
    var self = this;
    self.parent     = parent;
    self.backendURL = parent.backendURL;

    self.viewedID      = ko.observable(0);
    self.viewedQuestion = ko.observable();
    self.lastViewedID   = ko.observable(0);

    self.isViewingQuestion = ko.computed(function() {
        return self.viewedID() > 0;
    });

    self.questions = ko.observableArray();

    ko.computed(function() {
        console.log("Loading questions");
        
        var options = getFilterOptions();
        
        $.getJSON(self.backendURL + '/questions/', options).success(function(data) {
            var newQuestions = arrayFromJSON(data, 'QuestionList', Question);
            if (newQuestions)
                self.questions(newQuestions);
        });
    });
    
    // Bind to State Change
    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        var qid = getParameterByName('viewedID', State.hash);
        if (qid && qid != '' && qid != self.viewedID()) {
            self.viewedID(qid);
        }
    });

    // Detect change to viewedID and fetch new question to show!
    ko.computed(function() {
        console.log("Viewed ID changed. Updating");
        var newID = self.viewedID();
        if (newID <= 0)
            return;

        var q = self.findQuestion(newID);
        if (!q) {
            console.log("Error: Question with ID " + newID + " not found");
            return;
        }

        if (q.replies.peek().length < 1) {
            console.log("Loading replies for question: " + q.id());
            self.loadReplies(q);
        }

        self.viewedQuestion(q);
        self.lastViewedID(q.id());

        $(document).scrollTop(0);
    }).extend({ throttle: 200 });
	
	self.afterRenderUpdate = function(){
        var x = self.viewedQuestion();
		console.log("Scan for latex code");
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}

    self.viewQuestion       = self.viewQuestion.bind(this);
    self.isReplyAuthor      = self.isReplyAuthor.bind(this);
    self.isQuestionSelected = self.isQuestionSelected.bind(this);
    self.findQuestion       = self.findQuestion.bind(this);
    self.deleteQuestion     = self.deleteQuestion.bind(this);
    self.loadReplies        = self.loadReplies.bind(this);
    self.returnToQuestion   = self.returnToQuestion.bind(this);

 
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
        History.pushState({pageName: 'questions', rnd:Math.random()}, "Viewing Question: " + id, "/?viewedID=" + id);
    },
    returnToQuestion: function() {
        this.pushID(this.lastViewedID());
    },
    returnToResults: function() {
        var v = this.viewedID();
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



