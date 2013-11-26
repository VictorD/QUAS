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
          accept: "application/json",
          cache: false,
          dataType: 'json',
          xhrFields: {
                withCredentials: true
          },
          data: JSON.stringify(data)
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

function slide(element, valueAccessor) {
    var selected = ko.unwrap(valueAccessor());

    if (selected) {
        $(element).hide();
        $(element).effect('slide', {'direction':'left', 'mode': 'show'}, 800);
    }
    else {
        $(element).effect('slide', {'direction':'right', 'mode': 'hide'}, 800);
    }
}

function toggleVerticalMenu(data, event){
		
		var viewBox = $(event.currentTarget);
		var toggleBox = viewBox.next(".filterStuff:first");
		console.log("toggleBox");
		console.log(toggleBox);
		
//		viewBox.hide();
		toggleBox.slideToggle(500, function(){});
}

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
  //  init: slide,
    update: slide
};



