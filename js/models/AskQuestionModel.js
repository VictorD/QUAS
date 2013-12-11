
var AskQuestionModel = function(parent) {
   var self = this;
   self.body = ko.observable();
   self.title = ko.observable();
   
   self.lock = false;
   
   self.currentTags = ko.observableArray();
   self.newTag = ko.observable();
   
   

   self.addTag = function() {
      self.currentTags.push(self.newTag());
      self.newTag(null);
   }

   self.submitQuestion = function() {
      var data = {
         body: self.body(),
         title: self.title(),
         tags: self.currentTags()
      };
	  
	  console.log(self);
	if(!self.lock){
		self.lock=true;
      secureAjaxJSON(parent.backendURL + '/questions/', 'POST', data).success(
         function(response) {
            console.log("Created new question");
            console.log(response);   
            changePage('viewQuestion', "/?viewedID=" + response.Question.id);
         }
      ); 
	}
   }

   self.onPageLoad = function() {
      // Do nothing yet
   }
};
