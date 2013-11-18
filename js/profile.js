window.backendURL = 'http://130.240.5.168:5000';

var ProfileModel = function(parent){
	var self = this;

    $.support.cors = true;
	
    self.submitUsername = function(){
        var data = JSON.stringify(
            ko.toJS(
            // send only usr and desc etc if you want
                self.profile
            )
        );
        alert("we are in subU");
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
		console.log("wadup:" + parent.user().created());
	}

//	if edit==True: profile/edit, else profile/view
	self.editMode = ko.observable(false);
	self.profileView = ko.computed(function(){
		console.log("Profile view");
		return self.editMode() ? 'profile/edit' : 'profile/view';
	});
	// TODO: Fix cancel
	
	
	
    
}