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
            History.pushState({pageName: pageName}, null, "");
        }
        
        // Bind to State Change
        History.Adapter.bind(window,'statechange',function(){
            var State = History.getState();
            
            var newPage = State.data.pageName;
            var newModel = self.pages[newPage];
            if (newModel) {
                console.log(newPage);
                console.log(newModel);
                self.currentPage(newPage);
            }
            
            
        });
    };
    
    var viewModel = new ViewModel();
    console.log(viewModel)

	ko.applyBindings(viewModel);
});