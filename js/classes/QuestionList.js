
var QuestionList = function() {
    var self = this;
    self.questions = ko.observableArray();
    
    self.fromFilter = function(filterOptions) {
        if (!filterOptions)
            filterOptions = {}
            
        console.log("Loading questions");
        $.getJSON(self.backendURL + '/questions/', filterOptions).success(function(data) {
            self.fromJSON(data);
        });
    }
    
    self.fromSearch = function(searchData) {
        if (searchData) {
            var options = {
                search : self.searchData()
            }

            $.getJSON(self.backendURL + '/search/', options).success(function(data) {
                self.fromJSON(data['Search Result']);
            });
        }
    }
    
    self.fromJSON = function(jsonData) {
        var newQuestions = arrayFromJSON(jsonData, 'QuestionList', Question);
        if (newQuestions)
            self.questions(newQuestions);
    }
}