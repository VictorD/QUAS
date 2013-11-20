var Reply = function(data) {
   this.author    = ko.observable();
   this.id        = ko.observable();
   this.body      = ko.observable("Body placeholder");
   this.timestamp = ko.observable("undefined time");
   this.madeByMe  = ko.observable(false);

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