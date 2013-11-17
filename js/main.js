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

        self.currentPage  = ko.observable('questions')
        self.currentModel = ko.computed(function() {
            return self.pages[self.currentPage()];
        });
        
        self.changePage = function(pageName) {
            var newModel = self.pages[pageName];
            if (newModel) {
                console.log(pageName);
                console.log(newModel);
                self.currentPage(pageName);
            }
        }
    };
    
    var viewModel = new ViewModel();
    console.log(viewModel)

	ko.applyBindings(viewModel);
});