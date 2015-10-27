var require = function (scripts, loadCallback) {
	var length        = scripts.length;
	var first         = document.getElementsByTagName("script")[0];
	var parentNode    = first.parentNode;
	var loadedScripts = 0;
	var script;

	for (var i=0; i<length; i++) {
		script = document.createElement("script");
		script.async = true;
		script.type = "text/javascript";
		script.src = scripts[i];

		script.onload = function () {
			loadedScripts++;

			if (loadedScripts === length) {
				loadCallback();
			}
		};

		script.onreadystatechange = function () {
			if (script.readyState === "complete") {
				loadedScripts++;
				if (loadedScripts === length) {
					loadCallback();
				}
			}
		};
		parentNode.insertBefore(script, first);
	}
};

require(["http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js",], function () {
	$.ajax({
		type: "GET",
		url: 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true',
		dataType: "script"
	});
});
