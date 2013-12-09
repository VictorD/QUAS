var ListQuestionsModel = function(parent) {
    var self = this;
	self.qfilter = new qFilter();
    self.searchData = ko.observable();

    self.questionList = new QuestionList();
    self.questions    = self.questionList.questions;

    ko.computed(function() {
        var filterOptions = self.qfilter.options();
        //options['asc'] = 0;
        self.questionList.fromFilter(filterOptions);
    });

    ko.computed(function() {
        if (self.searchData() && self.searchData() != "") {
            self.questionList.fromSearch(self.searchData());
        }
    });

    self.onPageLoad = function() { 
        console.log("view question render callback");
        $('#questionList').hide(); 
        $('#questionList').fadeIn(1200);
    }
};



