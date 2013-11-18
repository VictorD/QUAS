$(function() {
    infuser.defaults.templateUrl = "templates";

    var User = function(data) {
       this.id        = ko.observable();
       this.email     = ko.observable();
       this.created   = ko.observable();
       this.last_seen = ko.observable();
       this.posts     = ko.observable();
       this.username  = ko.observable();
       if (data)
        this.update(data);
    };

    User.prototype.update = function(data) {
       this.id(data.id || 0);
       this.email(data.email);
       this.created(data.created_at);
       this.last_seen(data.last_seen);
       this.posts(data.posts);
       this.username(data.username);
    };

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

        self.userJSON = asyncDependentObservable(function() {
            return postJSON(window.backendURL + '/u/me/', 'GET');
        }, this);
    
        self.user = ko.computed(function() {
            return new User(self.userJSON().User);
        });

        self.loggedIn = ko.computed(function() {
            return (self.user().id() > 0);
        });

        self.logout = function() {
            postJSON(window.backendURL + '/u/logout', 'GET').done(function() {
                console.log("LOGGED OUT");
                History.replaceState({}, 'some title', '/');
                self.userJSON({});
            });
        }

        self.currentHeader = ko.computed(function() {
            var folder = 'header/';
            var file = 'guest';
            if (self.loggedIn()) {
                file = 'member'
            }
            return folder + file;
        });

        self.changePage = function(pageName) {
            History.pushState({pageName: pageName}, null, "/");
        }
        
        // Bind to State Change
        History.Adapter.bind(window,'statechange',function(){
            var State = History.getState();
            
            var newPage = State.data.pageName;
            var newModel = self.pages[newPage];
            if (newModel) {
                self.currentPage(newPage);
            }

            var usr = getParameterByName('user', location.search);
            if (usr) {
                self.tryLogin(usr);
            }
            
        });
    };
    
    var viewModel = new ViewModel();
    console.log(viewModel)

	ko.applyBindings(viewModel);
});