var User = function(data) {
   this.id        = ko.observable();
   this.email     = ko.observable();
   this.created   = ko.observable();
   this.last_seen = ko.observable();
   this.posts     = ko.observable();
   this.username  = ko.observable();
   this.description = ko.observable();
   this.votesum   = ko.observable();
   this.cache     = function(){};
   if (data)
    this.update(data);
};

ko.utils.extend(
User.prototype, {
    update: function(data){
   this.id(data.id || 0);
   this.email(data.email);
   this.created(data.created);
   this.last_seen(data.last_seen);
   this.posts(data.posts);
   this.username(data.username);
   this.description(data.description);
   this.votesum(data.votesum);
   this.cache.latestData = data;
   },
   revert: function(){
        this.update(this.cache.latestData);
   },
   commit: function(){
        this.cache.latestData=ko.toJS(this);
   }
});