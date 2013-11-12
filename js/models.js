function ListQuestionsModel(){
    this.qURI      = 'http://130.240.5.168:5000/questions/';
    this.questions = ko.observableArray();
    window.questionList = this.questions;

    $.getJSON(this.qURI).done(function(data) {
    console.log("We are in ajax();");

    var ql = data.QuestionList;

    for (var i = 0; i < ql.length; i++) {
	    //console.log("In the loop #"+i);
	    window.questionList.push({				
		    body: ko.observable(ql[i].body),
		    title: ko.observable(ql[i].title),
		    question_href: 
			    ko.observable("#!/view?question_id=" + 
					    ql[i].id),
		    id: ko.observable(ql[i].id),
		    tags: ko.observable(ql[i].tags),
		    timestamp: ko.observable(ql[i].timestamp),
		    done: ko.observable(ql[i].done)
	    });
    } 
    });

}

function getServerURI(target, id) {
    return 'http://130.240.5.168:5000/' + target + '/' + id + '/';
}

function ViewQuestionModel(){
	self = this;
    // Init observables so that they exist when view is loaded.
    self.body      = ko.observable("Loading question...");
    self.title     = ko.observable("Title placeholder");
	self.id        = ko.observable();
	self.tags      = ko.observable();
	self.timestamp = ko.observable();
    self.replies   = ko.observableArray();

    // Get the current param question_id from PageRoute
    self.question_id = pager.getActivePage().pageRoute.params.question_id;
    self.qURI = getServerURI('questions', self.question_id);
    self.question_found = false;

    // Update observables with AJAX (Takes time...)
    $.getJSON(self.qURI).done(function(data) {
		console.log("We are in ajax();");
		self.question_found = true;

		var q = data.Question;
		self.body(q.body);
		self.title(q.title);
		self.id(q.id);
		self.tags(q.tags);
		self.timestamp(q.timestamp);

        $.getJSON(self.qURI + "replies/").done(function(data) {
            console.log("We are in ajax too");
            var rl = data.ReplyList;
            for (var i = 0; i < rl.length; i++) {
	            self.replies.push({				
		            body: ko.observable(rl[i].body),
		            id: ko.observable(rl[i].id),
		            timestamp: ko.observable(rl[i].timestamp)
	            });
            } 
        });
	});

    
}
