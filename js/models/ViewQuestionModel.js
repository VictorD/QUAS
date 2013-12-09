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
        var currentUser = self.parent.user();
        var uid = (currentUser) ? currentUser.id() : 0;
        var qid = getIDFromHash();

        console.log("Loading question... " + qid);

        BackendAPI.getQuestion(qid, function(data) {
            var q = new Question(data['Question'], uid);
            var rl = data.ReplyList;
            for (var i = rl.length - 1; i >= 0; i--) {
                var r = new Reply(rl[i], uid);
                q.replies.push(r);
            }
            console.log("Loaded question: " + qid);
            self.viewedQuestion(q);
            self.afterRenderUpdate();
        });
    });
	
	self.afterRenderUpdate = function() {
		console.log("Scan for latex code");
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	};

    self.onPageLoad = function() { 
		console.log("view question render callback");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        $('#questionView').hide(); 
        $('#questionView').fadeIn(1200);
    };
};



