$(function() {
    infuser.defaults.templateUrl = "templates";
    
	/*var usr = querystring('user');
	if (usr) {
		window.userId = usr;
	}*/

	var ViewModel = function() {
        self = this;
        self.pages = {
            'questions' : new QuestionViewModel(),
            'profile'   : new ProfileModel()
        }

        self.currentPage  = ko.observable('questions');
        self.currentModel = ko.computed(function() {
            return self.pages[self.currentPage()];
        });
        
        self.changePage = function(pageName) {
            console.log(pageName);
            var newPage = self.pages[pageName];
            console.log(newPage);
           // if (newPage)
           //     self.currentPage(newPage);
        }
    };
    
	ko.applyBindings(new ViewModel());
});