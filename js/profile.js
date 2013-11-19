window.backendURL = 'http://130.240.5.168:5000';

var ProfileModel = function(parent){
	var self = this;

    $.support.cors = true;
	
    self.submitUsername = function(){
		self.profile().commit();
        var data = JSON.stringify(ko.toJS(self.profile));
        self.editMode(false);
        postJSON(window.backendURL + '/u/'+ parent.user().id() +'/', 'PUT', data).done(function(response) {
          console.log("POSTED BAD REQUEST?");
        }); 
    }

    self.profile = ko.observable();
    self.afterRenderCallback = function() { 
        $('#profileView').hide(); 
        $('#profileView').fadeIn(500);//effect('slide', {'direction':'left', 'mode':'show'}, 400); 
		//alert(parent.user.email);
		self.profile(parent.user());
		
	}

//	if edit==True: profile/edit, else profile/view
	self.editMode = ko.observable(false);
	self.profileView = ko.computed(function(){
		console.log("Profile view");
		
		return self.editMode() ? 'profile/edit' : 'profile/view';
	});
	// TODO: Fix cancel
	
	self.revertChange = function(){
		self.editMode(false);
		self.profile().revert();
	}  
}