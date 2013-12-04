
var ProfileModel = function(parent){

	var self = this;	
	self.parent = parent;
    self.submitUsername = function(){
		self.profile().commit();
        var data = JSON.stringify(ko.toJS(self.profile));
        self.editMode(false);
        secureAjaxJSON(parent.backendURL + '/u/'+ parent.user().id() +'/', 'PUT', data).done(function(response) {
          console.log("POSTED BAD REQUEST?");
        }); 
    }
	self.questions = ko.observableArray();
    self.profile = ko.observable();
    self.afterRenderCallback = function() { 
        $('#profileView').hide(); 
        $('#profileView').fadeIn(500);//effect('slide', {'direction':'left', 'mode':'show'}, 400); 
		//alert(parent.user.email);
		self.profile(parent.user());
	
      if (self.profile()) {
   		ko.computed(function() {
            console.log("Loading questions");
            // Load current users questions in profile.
            var options = {
            	paginate:1,
            	filter_by:'author',
            	filter_data: self.profile().username()
            };


            $.getJSON(parent.backendURL + '/questions/', options).success(function(data) {
			
            self.questions([]);
            data = data.QuestionList;
            for (var i = data.length - 1; i >= 0; i--) {
			console.log(i);
			
              self.questions.push(new Question(undefined, data[i]));
            };
			
            });
   		});
      }
   		
	}

//	if edit==True: profile/edit, else profile/view
	self.editMode = ko.observable(false);
	self.profileView = ko.computed(function(){
		console.log("Profile view");
		
		return self.editMode() ? 'profile/edit' : 'profile/view';
	});
	
	
	self.revertChange = function(){
		self.editMode(false);
		self.profile().revert();
	}  
	self.profilefilter = ko.observable(new qFilter());
	self.questions = ko.observableArray();
	
	

}