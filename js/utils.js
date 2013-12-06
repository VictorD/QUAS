
/* AJAX */

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


function arrayFromJSON(data, headerName, objName) {
    var arr = []
    var lst = data[headerName];
    if (lst) {
        for (var i = 0; i < lst.length; i++) {
            arr.push(new objName(lst[i]));
        }
    }
    return arr;
}


/* TRANSITIONS */


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

function toggleVerticalMenu(data, event){
		var viewBox = $(event.currentTarget);
		var toggleBox = viewBox.next(".filterStuff:first");
		console.log("toggleBox");
		console.log(toggleBox);
		toggleBox.slideToggle(500, function(){});
}

/* HISTORY */

function getParameterByName(name, hash) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(hash);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* KNOCKOUT BINDINGS */

function slide(element, valueAccessor, allBindings) {
    var slideDirection = allBindings.get('slideDirection') == 'left' ? 'left' : 'right';
    var selected = ko.unwrap(valueAccessor());
    if (selected) {
        $(element).hide();
        $(element).effect('slide', {'direction': slideDirection, 'mode': 'show'}, 700);
    }
    else {
        $(element).effect('slide', {'direction': slideDirection, 'mode': 'hide'}, 700);
    }
}


ko.bindingHandlers.slideVisible = {
  //  init: slide,
    update: slide
};



