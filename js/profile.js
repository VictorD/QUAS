window.backendURL = 'http://130.240.5.168:5000';

var Profile = function(data) {
  this.id           = ko.observable();
  this.description  = ko.observable();
  this.username   = ko.observable();
  this.update(data);
};

Profile.prototype.update = function(data) {
  this.id(data.id);
  this.description(data.description);
  this.username(data.username);
};

//  src: http://stackoverflow.com/questions/3788125/jquery-querystring
function querystring(key) {
   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
   var r=[], m;
   while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
   return r;
}

var ProfileModel = function(){
  $.support.cors = true;

  this.submitUsername = function(){
    var data = JSON.stringify({
      username: self.profile().username(),
      description: self.profile().description()
    });
  
    postJSON(window.backendURL + '/u/' + uid + '/', 'PUT', data).done(function(response) {
      console.log("POSTED BAD REQUEST?");
      self.responseJSON(response);
    }); 
  }

  var uid = querystring('user');

  this.profile = ko.observable();
  this.profile(new Profile({
    "User": {
      "create_at": "Wed, 13 Nov 2013 11:49:51 GMT", 
      "description": "", 
      "email": "ludwig.thurfjell@gmail.com", 
      "expires": "Wed, 13 Nov 2013 12:51:20 GMT", 
      "id": 6, 
      "last_seen": "Wed, 13 Nov 2013 11:51:20 GMT", 
      "token": "b1007fb85cde8110c1bb17861d1fb3cc7f4aa429cf02bc1ca6", 
      "username": "", 
      "votesum": 0
    }
  }));

  console.log(window.backendURL + '/u/' + uid +'/');

  var self = this;
  postJSON(window.backendURL + '/u/' + uid + '/', 'GET').done(function(response) {
    console.log("This is blejz");
    self.responseJSON(response);
  }); 
}