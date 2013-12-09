var ListQuestionsModel = function(parent) {
    var self = this;
	self.qfilter = ko.observable(new qFilter());
    self.parent     = parent;
    self.backendURL = parent.backendURL;

    self.viewedID   = ko.observable(0);

    self.questions  = ko.observableArray();
    self.searchData = ko.observable();
    
    self.updateQuestionsWithJSON = function(data) {
        var newQuestions = arrayFromJSON(data, 'QuestionList', Question);
        if (newQuestions)
            self.questions(newQuestions);
    }
    
    ko.computed(function() {
        if (self.searchData() && self.searchData() != "") {
            BackendAPI.search(function(data) {
               self.updateQuestionsWithJSON(data['Search Result']);
            }, self.searchData());
        }
    });

    ko.computed(function() {
        console.log("Loading questions");
        var filterOptions = self.qfilter().options();
        //options['asc'] = 0;
        
        BackendAPI.getQuestions(function(data) {
            self.updateQuestionsWithJSON(data);
        }, filterOptions);
    });
	
	self.afterRenderUpdate = function(){
        var x = self.viewedQuestion();
		console.log("Scan for latex code");
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}

    self.findQuestion       = self.findQuestion.bind(this);
    self.deleteQuestion     = self.deleteQuestion.bind(this);
};

ko.utils.extend(ListQuestionsModel.prototype, {
    findQuestion: function(id) {
        return ko.utils.arrayFirst(this.questions.slice(0), function(item) {
            return id == item.id();
        });
    },
    deleteQuestion: function(question) {
        var self = this;
        var qid = question.id();
        secureAjaxJSON(this.backendURL + '/questions/' + qid + '/', 'DELETE').done(function(result) {
            self.questions.remove(question);
        });
    },
    onPageLoad: function() { 
        console.log("view question render callback");
        $('#questionList').hide(); 
        $('#questionList').fadeIn(1200);
    }
});



