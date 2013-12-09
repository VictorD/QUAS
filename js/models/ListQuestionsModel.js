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
        var State = History.getState();
        var tags = getParameterByName('filterByTag', State.hash);
        console.log("tags:" + tags);
        if (tags) {
            self.qfilter.filterBy("tags");
            self.qfilter.filterData(tags);
        }
        
        console.log("view question render callback");1
        $('#questionList').hide(); 
        $('#questionList').fadeIn(1200);
    }
};



