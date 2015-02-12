var collisionCheck = require('./collision_check');

var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var UP_KEY = 38;
var SPACE_KEY = 32;
var FRICTION = 0.7;
var GRAVITY = 1.5;
var ACCELERATION = 2;

module.exports = function(blockWidth, blockHeight) {
	return function(x, y, color) {
		var keys = [];
		var that = {
			x: x * blockWidth,
			y: y * blockHeight,
			color: color,
			width: 1 * blockWidth,
			height: 2 * blockHeight,
			speed: 10,
			velX: 0,
			velY: 0,
			shouldJump: false,
			jumping: false,
			grounded: false
		};

		document.body.addEventListener('keydown', function(e) {
			if ((e.keyCode === UP_KEY || e.keyCode === SPACE_KEY) && !keys[e.keyCode]) {
				that.shouldJump = true;
			}
			keys[e.keyCode] = true;
		});
		 
		document.body.addEventListener('keyup', function(e) {
			keys[e.keyCode] = false;
		});

		that.draw = function(ctx) {
			ctx.fillStyle = that.color;
			ctx.fillRect(that.x, that.y, that.width, that.height);
		};
		that.update = function(world) {
			var boxes = world.boxes;

			if (that.shouldJump) {
				that.shouldJump = false;
				if(!that.jumping && that.grounded){
					that.jumping = true;
					that.grounded = false;
					that.velY = -that.speed*2;
				}
			}
			if (keys[RIGHT_KEY] && that.velX < that.speed) that.velX += ACCELERATION;
			if (keys[LEFT_KEY] && that.velX > -that.speed) that.velX -= ACCELERATION;

			that.velX *= FRICTION;
			that.velY += GRAVITY;
			that.x += that.velX;
			that.y += that.velY;

			if (that.x >= world.width-that.width) {
				that.x = world.width-that.width;
			} else if (that.x <= 0) {
				that.x = 0;
			}
			if (that.y >= world.height-that.height){
				that.y = world.height - that.height;
				that.jumping = false;
			}

			that.grounded = false;
			for (var i=0; i<world.boxes.length; i++){
				var collision = collisionCheck(that, world.boxes[i]);
				
				if (collision === 'left' || collision === 'right') {
					that.velX = 0;
					that.jumping = false;
				} else if (collision === 'bottom') {
					that.grounded = true;
					that.jumping = false;
				} else if (collision === 'top') {
					that.velY *= -(GRAVITY*(1/90));
				}
			}
			if (that.grounded) that.velY = 0;
		};

		return that;
	};
};