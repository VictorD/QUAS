var qFilter = function(){
	var self = this;
	self.filterBy = ko.observable("");
	self.filterData = ko.observable("");
	self.pageSize = ko.observable(10);
	self.orderBy = ko.observable();
	
	
	self.reset = function(){
		self.filterBy('');
        self.filterData('');
		self.pageSize(10);
		self.orderBy(undefined);
	}
	
	
	self.options = 	ko.computed(function() {
		var options ={paginate:1};
		
		if(self.filterData() != ""){
			if (self.filterBy() == 'author' || self.filterBy() == 'tags') {
				options.filter_by = self.filterBy();
				options.filter_data = self.filterData();
			}
		} else {
			self.filterBy("");
		}
		
		if(self.orderBy() == 'date' || self.orderBy() == 'vote' || self.orderBy() == 'name'){
			options.order_by = self.orderBy();
		}
		
		
		if(self.pageSize() == 5 || self.pageSize() == 15 || self.pageSize() == 25){
			options.page_size = self.pageSize();
		}
		
		
		console.log(options);
		return options;
	});
	
}
