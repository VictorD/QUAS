$(function() {
    $.support.cors = true;
    infuser.defaults.templateUrl = "templates";

    var User = function(data) {
       this.id        = ko.observable();
       this.email     = ko.observable();
       this.created   = ko.observable();
       this.last_seen = ko.observable();
       this.posts     = ko.observable();
       this.username  = ko.observable();
	   this.description = ko.observable();
	   this.votesum = ko.observable();
	   this.cache = function(){};
       if (data)
        this.update(data);
    };

    ko.utils.extend(
	User.prototype, {
		update: function(data){
       this.id(data.id || 0);
       this.email(data.email);
       this.created(data.created);
       this.last_seen(data.last_seen);
       this.posts(data.posts);
       this.username(data.username);
	   this.description(data.description);
	   this.votesum(data.votesum);
	   this.cache.latestData = data;
	   },
	   revert: function(){
			this.update(this.cache.latestData);
	   },
	   commit: function(){
			this.cache.latestData=ko.toJS(this);
	   }
    });

	var ViewModel = function() {
        self = this;
        self.backendURL = 'http://130.240.5.168:5000';
        self.user = ko.observable();

        ko.computed(function() {
            secureAjax(self.backendURL + '/u/amiloggedin/', 'GET').done(function(data) {
                self.loggedIn(data.Status);
                if (data.Status) {
                    secureAjax(self.backendURL + '/u/me/', 'GET').done(function(data) {
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

        self.loggedIn = ko.observable(false);
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