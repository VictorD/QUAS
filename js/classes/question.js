
var Question = function(data, parent) {
    var self = this ;
    self.isSelected = ko.observable(false);
    self.author    = ko.observable();
    self.id        = ko.observable();
    self.body      = ko.observable();
    self.title     = ko.observable();
    self.tags      = ko.observable();
    self.vote      = ko.observable();
    self.timestamp = ko.observable();
    self.replies   = ko.observableArray();

    if (data)
        self.update(data);
};

Question.prototype.update = function(data) {
   this.author(data.author || {username : "unknown"});
   this.id(data.id);
   this.body(data.body);
   this.title(data.title);
   this.vote(new Vote(this, data.score));
   this.tags(data.tags);
   this.timestamp(data.timestamp);
};

Question.prototype.submitQuestion = function(question, parent) {
   var data = {
      body: question.body(),
      title: question.title()
   };

   var self = this;
   secureAjaxJSON('http://130.240.5.168:5000' + '/questions/', 'POST', data).success(
      function(response) {
         console.log("Created new question");
         History.pushState({pageName: 'viewQuestions'}, null, "/?viewingID=" + response.Question.id);
      }
   ); 
}