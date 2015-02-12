var resources = require('./resources');

module.exports = function(blockWidth, blockHeight) {
	return function(x, y, width, height, url) {
		var that = {
			x: x * blockWidth,
			y: y * blockHeight,
			width: width * blockWidth,
			height: height * blockWidth,
			image: resources.get(url),
			draw: function(ctx) {
				ctx.fillStyle = ctx.createPattern(that.image, 'repeat');
				ctx.fillRect(that.x, that.y, that.width, that.height);
			}
		};

		return that;
	};
};