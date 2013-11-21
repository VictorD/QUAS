
var ProfileModel = function(parent){

	var self = this;	
	self.parent = parent;
    self.submitUsername = function(){
		self.profile().commit();
        var data = JSON.stringify(ko.toJS(self.profile));
        self.editMode(false);
        postJSON(parent.backendURL + '/u/'+ parent.user().id() +'/', 'PUT', data).done(function(response) {
          console.log("POSTED BAD REQUEST?");
        }); 
    }

    self.profile = ko.observable();
    self.afterRenderCallback = function() { 
        $('#profileView').hide(); 
        $('#profileView').fadeIn(500);//effect('slide', {'direction':'left', 'mode':'show'}, 400); 
		//alert(parent.user.email);
		self.profile(parent.user());
		
		ko.computed(function() {
		console.log("Loading questions");
		// Load current users questions in profile.
		  var options ={
				paginate:1,
				filter_by:'author',
				filter_data: self.parent.user().username()
			};
  	  

		  $.getJSON(parent.backendURL + '/questions/', options).success(function(data) {
			self.questions([]);
			data = data.QuestionList;
			for (var i = data.length - 1; i >= 0; i--) {
			  self.questions.push(new Question(data[i]));
			};
		  });
		});
		
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