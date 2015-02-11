var resources = {};

module.exports = {
	load: function(urls, callback) {
		callback = callback || function() {};
		var callbacks = urls.length;

		urls.forEach(function(url) {
			var img = new Image();
			img.onload = function() {
				resources[url] = img;

				if (!--callbacks) callback();
			};
			img.src = url;
		});
	},
	get: function(url) {
		if (!resources[url]) throw new Error('Could not load from cache: '+url);
		return resources[url];
	}
};