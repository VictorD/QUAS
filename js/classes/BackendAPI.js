(function() {

    var backendIP = '130.240.5.168:5000';
    
    function makeURL(endpoint) {
        return 'http://' + backendIP + '/' + endpoint + '/';
    }
    
    function getAjaxSecure(endpoint, callback, options) {
        options = options || {};
        secureAjax(makeURL(endpoint), 'GET', options).success(function(data) {
            callback(data);
        });
    };
    
    function getAjax(endpoint, callback, options) {
        options = options || {};
        $.getJSON(makeURL(endpoint), options).success(function(data) {
            callback(data);
        });
    };

    this.BackendAPI = {
        isLoggedIn: function(callback) {
            getAjaxSecure('u/amiloggedin', callback)
        },
        getCurrentUser: function(callback) {
            getAjaxSecure('u/me', callback)
        },        
        getQuestions: function(callback, filterOptions) {
            getAjax('questions', callback, filterOptions);
        },
        search: function(callback, searchData) {
            getAjax('search', callback, { search: searchData });
        }
    };
    
}).call(this);
