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

//  src: http://stackoverflow.com/questions/3788125/jquery-querystring
function querystring(key) {
   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
   var r=[], m;
   while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
   return r;
}

var ProfileModel = function(){
	var self = this;
	var uid = querystring('user');;
  $.support.cors = true;

  this.submitUsername = function(){
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

  


  this.profile = new Profile();

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
	
	this.profile = new Profile({"username":"Dupr"});
	
}