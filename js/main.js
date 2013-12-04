function changePage(pageName, hash) {
   console.log("Changing page: " + pageName);
   console.log(hash);
   
   if (!hash) { 
       hash = ""; 
   }

   History.pushState({pageName: pageName}, null, "/" + hash);
}

$(function() {
    $.support.cors = true;
    infuser.defaults.templateUrl = "templates";

	var ViewModel = function() {
        self = this;
        self.user       = ko.observable();
        self.backendURL = 'http://130.240.5.168:5000';
        self.loggedIn   = ko.observable(false);

        ko.computed(function() {
            secureAjax(self.backendURL + '/u/amiloggedin/', 'GET').done(function(data) {
                self.loggedIn(data.Status);
                if (data.Status) {
                    secureAjax(self.backendURL + '/u/me/', 'GET').success(function(data) {
                        self.user(new User(data.User));
                    });
                }
            });
        });

        self.pageModels = {
            'askQuestion'   : AddQuestionModel,
            'viewQuestion'  : ViewQuestionModel,
            'listQuestions' : ListQuestionsModel,
            'viewProfile'   : ProfileModel
        }

        self.currentHeader = ko.computed(function() {
            return self.loggedIn() ? 'header/member' : 'header/guest';
        });

        self.currentPage  = ko.observable('listQuestions');
        self.currentModel = ko.computed(function() {
            var vm = self.pageModels[self.currentPage()];
            return new vm(self);
        });

        self.logout = function() {
            secureAjaxJSON(self.backendURL + '/u/logout', 'GET').done(function() {
                History.replaceState({}, null, '/');
                self.loggedIn(false);
            });
        }

        self.goBack = function() { 
            console.log("backing up");
            History.back(); 
         }
        
        // Bind to State Change
        History.Adapter.bind(window,'statechange',function(){
            var State    = History.getState();
            var newPage  = State.data.pageName;
            var newModel = self.pageModels[newPage];
            if (newModel) {
                self.currentPage(newPage);
            }
        });
    };

    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
});