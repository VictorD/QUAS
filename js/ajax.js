
function postJSON(uri, method, data){
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