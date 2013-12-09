function getIDFromHash() {
    var State = History.getState();
    var qid = getParameterByName('viewedID', State.hash);
    if (!qid || qid == '')
        qid = 0;
    return qid;
}

var ViewQuestionModel = function(parent) {
    var self = this;
    self.parent = parent;
    self.viewedQuestion = ko.observable();

    ko.computed(function() {
        var qid = getIDFromHash();
        var cid = 0;
        var currentUser = self.parent.user();
        if (currentUser)
            cid = currentUser.id();

        console.log("Loading question... " + qid);

        $.getJSON(self.parent.backendURL + '/questions/' + qid + "/").success(function(data) {
            var q = new Question(data['Question']);
            var rl = data.ReplyList;
            for (var i = rl.length - 1; i >= 0; i--) {
                var r = new Reply(rl[i], cid);
                q.replies.push(r);
            }
            console.log("Loaded question: " + qid);
            self.viewedQuestion(q);
            self.afterRenderUpdate();
        });
    });
	
	self.afterRenderUpdate = function(){
		console.log("Scan for latex code");
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}

    self.isAuthor = ko.computed(function() {
        if (!self.parent.loggedIn())
            return false;

        var currentUser = self.parent.user();
        if (!currentUser)
            return false;
            
        console.log(currentUser);
        if (!self.viewedQuestion())
            return false;

        return self.viewedQuestion().author().id == currentUser.id();
    });

    self.isReplyAuthor      = self.isReplyAuthor.bind(this);
    self.deleteQuestion     = self.deleteQuestion.bind(this);
};

ko.utils.extend(ViewQuestionModel.prototype, {
    isReplyAuthor: function(reply) {
        var currentUser = this.parent.user();
        return (currentUser && reply && reply.author() && reply.author().id == currentUser.id());
    },
    deleteQuestion: function() {
         if (!this.viewedQuestion())
            return;

        var qid = this.viewedQuestion().id();
        if (qid > 0) {
            secureAjaxJSON(this.parent.backendURL + '/questions/' + qid + '/', 'DELETE').done(function(result) {
                changePage('listQuestions');
            });
        }
    },
    onPageLoad: function() { 
		console.log("view question render callback");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        $('#questionView').hide(); 
        $('#questionView').fadeIn(1200);
    }
    
});



