window.backendURL = 'http://130.240.5.168:5000';

var Reply = function(data) {
   this.author    = ko.observable();
   this.id        = ko.observable();
   this.body      = ko.observable("Body placeholder");
   this.timestamp = ko.observable("undefined time");
   if (data)
      this.update(data);
};

Reply.prototype.update = function(data) {
   this.author(data.author || "unknown");
   this.id(data.id);
   this.body(data.body);
   this.timestamp(data.timestamp);
};

Reply.prototype.submitReply = function(question) {
   var data = JSON.stringify({
      body: this.body(),
      question_id: question.id()
   });

   console.log("SENDING REPLY");
   console.log(data);
   postJSON(window.backendURL + '/replies/', 'POST', data).done(
      function(response) {
         console.log("POSTED TERRIBLE REPLY");
         question.replies.push(new Reply(response.Reply));
      }
   ); 
}