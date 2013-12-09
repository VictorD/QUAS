(function() {

    function makeURL(endpoint) {
        var backendIP = '130.240.5.168:5000';
        return 'http://' + backendIP + '/' + endpoint + '/';
    }
    
    function getAjaxSecure(endpoint, callback, options) {
        secureAjax(makeURL(endpoint), 'GET', options).success(function(data) {
            callback(data);
        });
    };

    function deleteAjax(endpoint, callback, options) {
      secureAjaxJSON(makeURL(endpoint), 'DELETE', options).success(function(data) {
         callback(data);
      });
    }
    
    function getAjax(endpoint, callback, options) {
        $.getJSON(makeURL(endpoint), options).success(function(data) {
            callback(data);
        });
    };

    this.BackendAPI = {
        /* USER MANAGEMENT */
        isLoggedIn: function(callback) {
            getAjaxSecure('u/amiloggedin', callback);
        },
        getCurrentUser: function(callback) {
            getAjaxSecure('u/me', callback);
        },     


        /* QUESTIONS */   
        getQuestion: function(id, callback) {
            getAjax('questions/' + id, callback);
        },
        deleteQuestion: function(id, callback) {
            deleteAjax('questions/' + id, callback);
        },
        getQuestions: function(callback, filterOptions) {
            getAjax('questions', callback, filterOptions);
        },


        /* SEARCH */
        search: function(callback, searchData) {
            getAjax('search', callback, { search: searchData });
        }
    };
    
}).call(this);
