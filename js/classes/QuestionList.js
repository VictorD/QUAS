
var QuestionList = function() {
    var self = this;
    self.questions = ko.observableArray();


    self.findByID = function(id) {
        return ko.utils.arrayFirst(this.questions.slice(0), function(item) {
            return id == item.id();
        });
    };

    self.fromJSON = function(jsonData) {
        var newQuestions = arrayFromJSON(jsonData, 'QuestionList', Question);
        if (newQuestions)
            self.questions(newQuestions);
    };

    self.fromFilter = function(filterOptions) {
        if (!filterOptions)
            filterOptions = {}
            
        console.log("Loading questions with filter: ");
        console.log(filterOptions);
        BackendAPI.getQuestions(function(data) {
            self.fromJSON(data);
        }, filterOptions);
    };
    
    self.fromSearch = function(searchData) {
        if (searchData) {
            BackendAPI.search(function(data) {
               self.fromJSON(data['Search Result']);
            }, { 
                search: searchData 
            });
        }
    };
    
    
}