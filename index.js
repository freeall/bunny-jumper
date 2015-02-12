var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;
var MAP_WIDTH = 30;
var MAP_HEIGHT = 20;

var resources = require('./resources');
var player = require('./player')(BLOCK_WIDTH, BLOCK_HEIGHT);
var box = require('./box')(BLOCK_WIDTH, BLOCK_HEIGHT);

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

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
var draw = function() {
	ctx.clearRect(0, 0, world.width, world.height);
	ctx.drawImage(resources.get('background.gif'), 0, 0, world.width, world.height);

	world.boxes.forEach(function(box) {
		box.draw(ctx);
	});
	world.players.forEach(function(player) {
		player.draw(ctx);
	});
};

var loadResources = function(callback) {
	resources.load(['background.gif', 'spike.gif'], callback);
};
var generateWorld = function() {
	world.players = [
		player(10, 10, 'red')
	];
	world.boxes = [
		box(0, 0, MAP_WIDTH, 1, 'spike.gif'),
		box(0, MAP_HEIGHT-1, MAP_WIDTH, 1, 'spike.gif')
		// box(0, 0, 2, world.height, 'black'),
		// box(0, world.height - 2, world.width, 2, 'black'),
		// box(world.width - 2, 0, 50, world.height, 'black'),
		// box(0, 0, world.width, 2, 'black'),
		// box(120, 10, 20, 20, 'black'),
		// box(170, 50, 20, 20, 'black'),
		// box(220, 100, 20, 20, 'black'),
		// box(270, 150, 40, 40, 'black')
	];
};

canvas.width = world.width;
canvas.height = world.height;

document.body.addEventListener('keydown', function(e) {
	// e.preventDefault();
});

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var lastTime;

var main = function() {
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;

	update(dt);
	draw();

	lastTime = now;
	requestAnimationFrame(main);
};

loadResources(function() {
	generateWorld();
	main();
});
