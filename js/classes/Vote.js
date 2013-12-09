
var Vote = function(question, initValue) {
    var self = this;

    self.voteCast = 0;
    self.question = question;
    self.score = ko.observable(initValue);

    self.fromScore = ko.computed(function() {
        var x = self.score();
        var s = "votedNeutral"

        if (x > 0)
            s = "votedGood";
        else if (x < 0)
            s = "votedBad";

        return s;
    });

    self.upvote = function() {
        if (self.voteCast < 1)
            self.submitVote(1);
    }
    self.downvote = function() { 
        if (self.voteCast > -1) 
            self.submitVote(-1)
    }
    
    self.submitVote = function(v) {
        self.voteCast = v;

        var data = {
          question_id: self.question.id(),
          value: v
        };

        secureAjaxJSON('http://130.240.5.168:5000/vote/q/', 'POST', data).done(
          function(response) {
            self.score(response.score);
            console.log("YOUR VOTE HAS BEEN CAST.");
          }); 
    }
}