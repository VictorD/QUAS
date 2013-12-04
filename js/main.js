$(function() {
    $.support.cors = true;
    infuser.defaults.templateUrl = "templates";

	var ViewModel = function() {
        self = this;
        self.backendURL = 'http://130.240.5.168:5000';
        self.loggedIn = ko.observable(false);
        self.user = ko.observable();

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
            'viewQuestions' : QuestionViewModel,
            'askQuestion'   : QuestionAddModel,
            'profile'       : ProfileModel
        }

        self.currentPage  = ko.observable('viewQuestions');
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

        self.currentHeader = ko.computed(function() {
            var file = self.loggedIn() ? 'member' : 'guest';
            return 'header/' + file;
        });

        self.changePage = function(pageName) {
            History.pushState({pageName: pageName}, null, "/");
        }
        
        // Bind to State Change
        History.Adapter.bind(window,'statechange',function(){
            var State = History.getState();
            
            var newPage = State.data.pageName;
            var newModel = self.pageModels[newPage];
            if (newModel) {
                console.log(newPage);
                console.log(self.currentModel());
                self.currentPage(newPage);
            }
        });
    };

    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
});