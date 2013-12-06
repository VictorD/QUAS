
var Question = function(data, parent) {
    var self = this ;
    self.isSelected = ko.observable(false);
    self.author    = ko.observable();
    self.id        = ko.observable();
    self.body      = ko.observable();
    self.title     = ko.observable();
    self.tags      = ko.observable();
    self.vote      = ko.observable();
    self.timestamp = ko.observable();
    self.replies   = ko.observableArray();

    if (data)
        self.update(data);
};

Question.prototype.update = function(data) {
    this.author(data.author || {username : "unknown"});
    this.id(data.id);
    if (data.body) {
        var parsed = new bbcode.Parser().toHTML(data.body);
        this.body(parsed);
    }
    this.title(data.title);
    this.vote(new Vote(this, data.score));
    this.tags(data.tags);
    this.timestamp(data.timestamp);
};