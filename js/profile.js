window.backendURL = 'http://130.240.5.168:5000';

var Profile = function() {
  this.id           = ko.observable();
  this.description  = ko.observable();
  this.username   	= ko.observable();
  this.create_at	= ko.observable();
};

Profile.prototype.update = function(data) {
  this.id(data.id);
  this.description(data.description);
  this.username(data.username);
  this.create_at(data.create_at);
};

var ProfileModel = function(){
	var self = this;
	var uid = querystring('user');;
    $.support.cors = true;

    self.submitUsername = function(){
        var data = JSON.stringify(
            ko.toJS(
            // send only usr and desc if u want lolz
                self.profile
            )
        );
        alert("we are in subU");
        postJSON(window.backendURL + '/u/' + uid + '/', 'PUT', data).done(function(response) {
          console.log("POSTED BAD REQUEST?");
        }); 
    }

    self.profile = ko.observable(new Profile());
    self.animatePageChange = function() { 
        $('#profileView').hide(); 
        $('#profileView').fadeIn(500);//effect('slide', {'direction':'left', 'mode':'show'}, 400); 
    }    
    self.afterRenderCallback = function(elements) {
        console.log(window.backendURL + '/u/' + uid +'/');

        $.ajax({
            url: 'http://130.240.5.168:5000/u/' + uid + '/',
            dataType: 'json',
            success: function(data){
            console.log(data.User);
            self.profile.update(data.User);
            },
            error: function(jqXHR, textStatus, errorThrown){
            console.log("error");
            }
        });
    }

    self.stateChangeCallback = function() {
        
    }
}