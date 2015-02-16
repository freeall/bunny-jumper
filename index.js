var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;
var MAP_WIDTH = 50;
var MAP_HEIGHT = 20;

var resources = require('./resources');
var player = require('./player')(BLOCK_WIDTH, BLOCK_HEIGHT);
var block = require('./block')(BLOCK_WIDTH, BLOCK_HEIGHT);
// var url = require('url');
// var Peer = require('peerjs');

// var serverId = url.parse(location.href, true)).query.id;
// if (!serverId) {
// 	alert('Use the url given')
// 	throw new Error('No server to connect to;')
// }

// var peer = new Peer({key:'x87tkqzsswoh6w29'});
// console.log(peer.id);
// peer.on('open', function(id) {
// 	console.log(id);
// });
// return;


var showGrid = false;
var world = {
	context: document.createElement('canvas').getContext('2d'),
	width: BLOCK_WIDTH * MAP_WIDTH,
	height: BLOCK_HEIGHT * MAP_HEIGHT,
	players: [],
	blocks: []
};

var update = function(dt) {
	world.players.forEach(function(player) {
		player.update(world, dt);
	});
};
var draw = function(ctx, dt) {
	world.context.clearRect(0, 0, world.width, world.height);
	world.context.drawImage(resources.get('background.gif'), 0, 0, world.width, world.height);

	world.blocks.forEach(function(block) {
		block.draw(world.context, dt);
	});
	world.players.forEach(function(player) {
		player.draw(world.context, dt);
	});

	if (showGrid) grid(world.context);

	var sWidth = dWidth = ctx.canvas.width;
	var sHeight = dHeight = ctx.canvas.height;
	var sx = world.players[0].x - dWidth/2 + world.players[0].width/2;
	var sy = world.players[0].y - dHeight/2 + world.players[0].height/5;
	var dx = 0;
	var dy = 0;
	sx = Math.min(sx, world.context.canvas.width-dWidth);
	sx = Math.max(sx, 0);
	sy = Math.min(sy, world.context.canvas.height-dHeight);
	sy = Math.max(sy, 0);
	ctx.drawImage(world.context.canvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
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
	resources.load([
		'background.gif', 'lazer-block.gif', 'spike.gif',
		'stand-right.png', 'stand-left.png',
		'run-right1.png', 'run-right2.png', 'run-left1.png', 'run-left2.png',
		'jump-right.png', 'jump-left.png'
	], callback);
};
var generateWorld = function() {
	world.players = [
		player(10, 10, 'red')
	];
	world.blocks = [
		block(0, 0, MAP_WIDTH, 1, 'spike.gif'),
		block(0, MAP_HEIGHT-1, MAP_WIDTH, 1, 'lazer-block.gif'),
		block(10, 16, 2, 1, 'lazer-block.gif'),
		block(13, 13, 2, 1, 'lazer-block.gif'),
		block(16, 10, 2, 1, 'lazer-block.gif'),
		block(19, 7, 2, 1, 'lazer-block.gif'),
		block(13, 6, 2, 1, 'lazer-block.gif')
	];
};

(function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	world.context.canvas.width = world.width;
	world.context.canvas.height = world.height;
	canvas.width = 700;
	canvas.height = 500;

	// // Generally prevent the arrows to cause a change in the display
	// document.body.addEventListener('keydown', function(e) {
	// 	e.preventDefault();
	// });
	document.body.addEventListener('keypress', function(e) {
		if (e.keyCode === 103) showGrid = !showGrid;
	});

	var lastTime = Date.now();
	var mainLoop = function() {
		var now = Date.now();
		var dt = (now - lastTime) / 1000.0;

		update(dt);
		draw(ctx, dt);

		lastTime = now;
		requestAnimationFrame(mainLoop);
	};

	loadResources(function() {
		world.background = world.context.createPattern(resources.get('background.gif'), 'repeat');
		generateWorld();
		mainLoop();
	});
})();
