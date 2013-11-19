$(function() {
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

        self.user = ko.observable();

        ko.computed(function() {
            postJSON(window.backendURL + '/u/me/', 'GET').success(function(data) {
                console.log("wat");
                self.user(new User(data.User));
            }).error(function(XMLHttpRequest, textStatus, errorThrown) { console.log("ERR")});
        });
        
        self.pages = {
            'questions' : new QuestionViewModel(),
            'profile'   : new ProfileModel(this)
        }

        self.currentPage  = ko.observable('questions');
        self.currentModel = ko.computed(function() {
            return self.pages[self.currentPage()];
        });

        self.loggedIn = ko.computed(function() {
            return (self.user());
        });

        self.logout = function() {
            postJSON(window.backendURL + '/u/logout', 'GET').done(function() {
                console.log("LOGGED OUT");
                History.replaceState({}, null, '/');
                self.user();
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


            
        });
    };
    
    var viewModel = new ViewModel();
    

	ko.applyBindings(viewModel);
});