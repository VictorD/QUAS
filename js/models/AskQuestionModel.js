
var AskQuestionModel = function(parent) {
   var self = this;
   self.currentTags = ko.observableArray();
   self.newTag = ko.observable();

   self.addTag = function() {
      self.currentTags.push(self.newTag());
      self.newTag(null);
   }

   self.submitQuestion = function(question, parent) {
      var data = {
         body: question.body(),
         title: question.title(),
         tags: self.currentTags()
      };

      secureAjaxJSON('http://130.240.5.168:5000' + '/questions/', 'POST', data).success(
         function(response) {
            console.log("Created new question");
            console.log(response);   
            changePage('viewQuestion', "/?viewedID=" + response.Question.id);
         }
      ); 

   }
};
