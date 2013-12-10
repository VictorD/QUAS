
var Vote = function(owner, replyVote, initValue) {
    var self = this;
    self.replyVote = replyVote;
    self.voteCast = 0;
    self.owner = owner;
    self.score = ko.observable(initValue);

    self.voteType = (replyVote) ? 'reply_id':'question_id';

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

        var options = { 
            value: v 
        };

        var voteType = (replyVote) ? 'reply_id':'question_id';
        options[voteType] = self.owner.id();

        var endpoint = voteType[0];

        console.log(options);

        BackendAPI.vote(endpoint, function(response) {
            self.score(response.score);
            console.log("YOUR VOTE HAS BEEN CAST: " + response.score);
        }, options); 
    }
}