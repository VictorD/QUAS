
var Question = function(data, currentUserID) {
    var self = this ;
    self.madeByCurrentUser = ko.observable(false);
    self.author    = ko.observable();
    self.id        = ko.observable();
    self.body      = ko.observable();
    self.title     = ko.observable();
    self.tags      = ko.observable();
    self.vote      = ko.observable();
    self.timestamp = ko.observable();
    self.replies   = ko.observableArray();

    self.deleteSelf = function() {
        if (confirm("Delete this question?")) {
            BackendAPI.deleteQuestion(self.id(), function(data) {
                changePage('listQuestions');
            });
        }
    };

    self.update = function(data) {
        this.author(data.author || {username : "unknown"});
        this.id(data.id);
        if (data.body)
            this.body(new bbcode.Parser().toHTML(data.body));

        this.title(data.title);
        this.vote(new Vote(this, data.score));
        this.tags(data.tags);
        this.timestamp(data.timestamp);
    };

    if (data)
        self.update(data);

    if (this.author() && currentUserID > 0)
        this.madeByCurrentUser(currentUserID == this.author().id);
   
};