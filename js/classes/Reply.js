var Reply = function(data, currentUserID) {
   this.author     = ko.observable();
   this.id         = ko.observable();
   this.body       = ko.observable();
   this.timestamp  = ko.observable();
   this.madeByCurrentUser = ko.observable(false);

   if (data)
      this.update(data);

   if (this.author() && currentUserID > 0) {
      this.madeByCurrentUser(this.author().id == currentUserID);
      console.log("wadup");
   }
};

Reply.prototype.update = function(data) {
   this.author(data.author || "unknown");
   this.id(data.id);
   if (data.body)
     this.body(new bbcode.Parser().toHTML(data.body));

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