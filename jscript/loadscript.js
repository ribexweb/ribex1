loadedScript = {};
loadingScript = {};
pendingScriptSuccess = {};

function loadScript (url, success, async) {
	if(loadedScript[url]) {
		//success();
		return;
	}

	pendingScriptSuccess[url] =  Array.isArray(pendingScriptSuccess[url]) ? pendingScriptSuccess[url].push(success) : [success];
	
	if(loadingScript[url]) {
		return;
	}
	loadedScript[url] = false;
	loadingScript[url] = true;

	async = async || true;
	$.ajax({
        crossDomain: true,
        dataType: "script",
        url: url,
        async: async,
        success: (function (url) {
        	return function (data) {
	        	loadedScript[url] = true;
	        	loadingScript[url] = false;
	        	for (var i=0, len=pendingScriptSuccess[url].length; i<len; i++) {
	        		if(pendingScriptSuccess[url][i])
	        			pendingScriptSuccess[url][i](data);
	        	}
	        	delete pendingScriptSuccess[url];
	        };
        })(url)
    })
}


function loadCSS (url) {
    var ss = document.styleSheets;
    for (var i = 0, max = ss.length; i < max; i++) {
        if (ss[i].href == url)
            return;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;

    document.getElementsByTagName("head")[0].appendChild(link);
}
