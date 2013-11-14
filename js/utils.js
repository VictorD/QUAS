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

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        $(element).hide();
         
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    },
    update: function(element, valueAccessor) {
        $(element).hide();
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};
