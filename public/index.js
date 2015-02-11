(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var resources = require('./resources');

var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var UP_KEY = 38;
var SPACE_KEY = 32;
var FRICTION = 0.8;
var GRAVITY = 0.3;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = 500;
var height = 200;
var keys = [];
var player = {
	x: width/2,
	y: height - 5,
	width: 8,
	height: 8,
	speed: 3,
	velX: 0,
	velY: 0,
	shouldJump: false,
	jumping: false,
	grounded: false
};
var boxes = require('./boxes')(width, height);

var collisionCheck = function(shapeA, shapeB) {
	// get the vectors to check against
	var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2));
	var vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2));
	// add the half widths and half heights of the objects
	var hWidths = (shapeA.width / 2) + (shapeB.width / 2);
	var hHeights = (shapeA.height / 2) + (shapeB.height / 2);
	var res = null;
	// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         
	    // figures out on which side we are colliding (top, bottom, left, or right)
    	var oX = hWidths - Math.abs(vX);
    	var oY = hHeights - Math.abs(vY);
    	if (oX >= oY) {
			if (vY > 0) {
				res = 'top';
				shapeA.y += oY;
			} else {
				res = 'bottom';
				shapeA.y -= oY;
			}
		} else {
			if (vX > 0) {
				res = 'left';
				shapeA.x += oX;
			} else {
				res = 'right';
				shapeA.x -= oX;
			}
		}
	}
	return res;
};

var update = function() {
	if (player.shouldJump) {
		player.shouldJump = false;
		if(!player.jumping && player.grounded){
			player.jumping = true;
			player.grounded = false;
			player.velY = -player.speed*2;
		}
	}
	if (keys[RIGHT_KEY]) {
		if (player.velX < player.speed) {
		   player.velX++;
		}
	}
	if (keys[LEFT_KEY]) {
		if (player.velX > -player.speed) {
		   player.velX--;
		}
	}

	player.velX *= FRICTION;
	player.velY += GRAVITY;
	player.x += player.velX;
	player.y += player.velY;

	if (player.x >= width-player.width) {
		player.x = width-player.width;
	} else if (player.x <= 0) {
		player.x = 0;
	}
	if (player.y >= height-player.height){
		player.y = height - player.height;
		player.jumping = false;
	}

	player.grounded = false;
	for (var i=0; i<boxes.length; i++){
		var collision = collisionCheck(player, boxes[i]);
		
		if (collision === 'left' || collision === 'right') {
			player.velX = 0;
			player.jumping = false;
		} else if (collision === 'bottom') {
			player.grounded = true;
			player.jumping = false;
		} else if (collision === 'top') {
			player.velY *= -GRAVITY;
		}
	}
	if (player.grounded) player.velY = 0;
};
var draw = function() {
	ctx.clearRect(0,0,width,height);

	// Boxes
	ctx.fillStyle = 'black';
	ctx.beginPath();

	for (var i=0; i<boxes.length; i++) {
		ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
	}

	ctx.fill();

	// Player
	ctx.fillStyle = 'red';
	ctx.fillRect(player.x, player.y, player.width, player.height);
};

canvas.width = width;
canvas.height = height;

document.body.addEventListener('keydown', function(e) {
	if ((e.keyCode === UP_KEY || e.keyCode === SPACE_KEY) && !keys[e.keyCode]) {
		player.shouldJump = true;
	}
	keys[e.keyCode] = true;
});
 
document.body.addEventListener('keyup', function(e) {
	keys[e.keyCode] = false;
});

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var lastTime;
(function main() {
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;

	update(dt);
	draw();

	lastTime = now;
	requestAnimationFrame(main);
})();

},{"./boxes":1,"./resources":3}],3:[function(require,module,exports){
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
},{}]},{},[2]);
