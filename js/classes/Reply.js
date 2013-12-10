var Reply = function(data, currentUserID) {
   var self = this;
   self.author     = ko.observable();
   self.id         = ko.observable();
   self.body       = ko.observable();
   self.timestamp  = ko.observable();
   self.vote      = ko.observable();
   self.madeByCurrentUser = ko.observable(false);

   if (data)
      self.update(data);

   if (self.author() && currentUserID > 0) {
      self.madeByCurrentUser(self.author().id == currentUserID);
   }
};

Reply.prototype.update = function(data) {
   this.author(data.author || "unknown");
   this.id(data.id);
   if (data.body)
     this.body(new bbcode.Parser().toHTML(data.body));
   
   this.vote(new Vote(this, true, data.score));
   this.timestamp(data.timestamp);
};

Reply.prototype.submitReply = function(question) {
   var data = {
      body: this.body(),
      question_id: question.id()
   };

   secureAjaxJSON('http://130.240.5.168:5000' + '/replies/', 'POST', data).done(
      function(response) {
         console.log("Sent Reply");
         question.replies.push(new Reply(response.Reply));
      }
   ); 
}