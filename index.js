var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;
var MAP_WIDTH = 30;
var MAP_HEIGHT = 20;

var resources = require('./resources');
var player = require('./player')(BLOCK_WIDTH, BLOCK_HEIGHT);
var box = require('./box')(BLOCK_WIDTH, BLOCK_HEIGHT);

var showGrid = false;
var world = {
	width: BLOCK_WIDTH * MAP_WIDTH,
	height: BLOCK_HEIGHT * MAP_HEIGHT,
	players: [],
	boxes: []
};

var update = function(dt) {
	world.players.forEach(function(player) {
		player.update(world);
	});
};
var draw = function(ctx) {
	ctx.clearRect(0, 0, world.width, world.height);
	ctx.drawImage(resources.get('background.gif'), 0, 0, world.width, world.height);

	world.boxes.forEach(function(box) {
		box.draw(ctx);
	});
	world.players.forEach(function(player) {
		player.draw(ctx);
	});

	if (showGrid) grid(ctx);
};

var grid = function(ctx) {
	ctx.beginPath();
	ctx.textBaseline = 'middle';
	ctx.font = '10px Sans-Serif';
	ctx.strokeStyle = 'green';

	for (var i=0; i<MAP_WIDTH; i++) {
		ctx.moveTo(i*BLOCK_WIDTH, 0);
		ctx.lineTo(i*BLOCK_WIDTH, world.height);
	}
	for (var i=0; i<MAP_HEIGHT; i++) {
		ctx.moveTo(0, i*BLOCK_HEIGHT);
		ctx.lineTo(world.width, i*BLOCK_HEIGHT);
	}
	for (var i=0; i<MAP_WIDTH; i++) {
		for (var j=0; j<MAP_HEIGHT; j++) {
			var coord = i+','+j;
			var text = ctx.measureText(coord);
			ctx.strokeText(coord, i*BLOCK_WIDTH + (BLOCK_WIDTH/2 - text.width/2), j*BLOCK_HEIGHT + BLOCK_HEIGHT/2);
		}
	}

	ctx.stroke();
};
var loadResources = function(callback) {
	resources.load(['background.gif', 'lazer-block.gif', 'spike.gif'], callback);
};
var generateWorld = function() {
	world.players = [
		player(10, 10, 'red')
	];
	world.boxes = [
		box(0, 0, MAP_WIDTH, 1, 'spike.gif'),
		box(0, MAP_HEIGHT-1, MAP_WIDTH, 1, 'lazer-block.gif'),
		box(10, 16, 2, 1, 'lazer-block.gif'),
		box(13, 13, 2, 1, 'lazer-block.gif'),
		box(16, 10, 2, 1, 'lazer-block.gif'),
		box(19, 7, 2, 1, 'lazer-block.gif'),
		box(13, 6, 2, 1, 'lazer-block.gif')
	];
};


(function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	canvas.width = world.width;
	canvas.height = world.height;

	// // Generally prevent the arrows to cause a change in the display
	// document.body.addEventListener('keydown', function(e) {
	// 	e.preventDefault();
	// });
	document.body.addEventListener('keypress', function(e) {
		if (e.keyCode === 103) showGrid = !showGrid;
	});

	var lastTime;
	var mainLoop = function() {
		var now = Date.now();
		var dt = (now - lastTime) / 1000.0;

		update(dt);
		draw(ctx);

		lastTime = now;
		requestAnimationFrame(mainLoop);
	};

	loadResources(function() {
		generateWorld();
		mainLoop();
	});
})();
