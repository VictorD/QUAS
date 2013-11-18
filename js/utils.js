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

// source: https://github.com/knockout/knockout/wiki/Asynchronous-Dependent-Observables
function asyncDependentObservable(evaluator, owner) {
    var result = ko.observableArray();
    
    ko.dependentObservable(function() {
        // Get the $.Deferred value, and then set up a callback so that when it's done,
        // the output is transferred onto our "result" observable
        evaluator.call(owner).done(result);        
    });
    
    return result;
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

ko.bindingHandlers.slideVisible = {
    slide: function(element, valueAccessor, allBindings) {
        $(element).hide();
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        //ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
        ko.unwrap(value) ? $(element).effect('slide', {'direction':'down', 'mode':'show'}, 200) : $(element).fadeOut();
        /*$(element).hide();
        // First get the latest data that we're bound to
        var value = valueAccessor();
 
        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);
    
        console.log(allBindings());
        var direction = allBindings().slideDirection || 'left';
        // Grab some more data from another binding property
        var duration = allBindings().slideDuration || 400; // 400ms is default duration unless otherwise specified
 
        console.log(direction + " " + duration);
        $(element).effect('slide', {'direction':direction, 'mode':'show'}, duration);*/
    },
    init: this.slide,
    update: this.slide
};