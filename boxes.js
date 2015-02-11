module.exports = function(width, height) {
	return [
		{
			x: 0,
			y: 0,
			width: 2,
			height: height
		}, {
			x: 0,
			y: height - 2,
			width: width,
			height: 2
		}, {
			x: width - 2,
			y: 0,
			width: 50,
			height: height
		}, {
			x: 0,
			y: 0,
			width: width,
			height: 2
		}, {
			x: 120,
			y: 10,
			width: 20,
			height: 20
		}, {
			x: 170,
			y: 50,
			width: 20,
			height: 20
		}, {
			x: 220,
			y: 100,
			width: 20,
			height: 20
		}, {
			x: 270,
			y: 150,
			width: 40,
			height: 40
		}
	];
};