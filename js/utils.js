function secureAjax(uri, method, data){
    var request = {
          url: uri,
          type: method,
          cache: false,
          xhrFields: {
                withCredentials: true
             },
          data: data
            };

    return $.ajax(request);
}

function secureAjaxJSON(uri, method, data){
    var request = {
          url: uri,
          type: method,
          contentType: "application/json",
          accepts: "application/json",
          cache: false,
          dataType: 'json',
          xhrFields: {
                withCredentials: true
             },
          data: data
    };

    return $.ajax(request);
}

function spinnerLoader(page, element) {
    var loader = {};
    var txt = $('<img class="loader" src="img/loader.gif"/>');
    loader.load = function () {
      $(element).empty();
      $(element).append(txt);
    };
    loader.unload = function () {
      txt.remove();
    };
    return loader;
}

function getParameterByName(name, hash) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(hash);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor, allBindings) {
        $(element).hide();
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        //ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
        var show = ko.unwrap(value) ? 'show' : 'hide';
        $(element).effect('slide', {'direction':'left', 'mode':show}, 4000);
        console.log(element);
        console.log("wadup");

    }
};


 function toggleVerticalMenu(data, event){
		
		var viewBox = $(event.currentTarget);
		var toggleBox = viewBox.next(".filterStuff:first");
		console.log("toggleBox");
		console.log(toggleBox);
		
//		viewBox.hide();
		toggleBox.slideToggle(500, function(){});
}


