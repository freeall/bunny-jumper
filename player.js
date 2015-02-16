var resources = require('./resources');
var collisionCheck = require('./collision_check');

var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var UP_KEY = 38;
var SPACE_KEY = 32;
var FRICTION = 0.7;
var GRAVITY = 1.5;
var ACCELERATION = 3;


module.exports = function(blockWidth, blockHeight) {
	return function(x, y, color) {
		var keys = [];
		var that = {
			x: x * blockWidth,
			y: y * blockHeight,
			color: color,
			width: 1 * blockWidth,
			height: 1.5 * blockHeight,
			speed: 10,
			velX: 0,
			velY: 0,
			sprite: {
				time: 0,
				frame: 0
			},
			position: 'stand-left',
			shouldJump: false,
			jumping: false,
			grounded: false
		};
		var frames = {
			'stand-left': [resources.get('stand-left.png')],
			'stand-right': [resources.get('stand-right.png')],
			'run-right': [resources.get('run-right1.png'), resources.get('run-right2.png')],
			'run-left': [resources.get('run-left1.png'), resources.get('run-left2.png')],
			'jump-left': [resources.get('jump-left.png')],
			'jump-right': [resources.get('jump-right.png')]
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

		that.draw = function(ctx, dt) {
			var img = frames[that.position][that.sprite.frame];
			ctx.drawImage(img, 0, 0, img.width, img.height, that.x, that.y, img.width, img.height-8);
		};
		var dt = 0;
		that.update = function(world, _dt) {
			dt += _dt;
			if (dt < 0.01) return;
			var boxes = world.boxes;
			var oldX = Math.floor(that.x);
			var oldY = Math.floor(that.y);
			var oldJumping = that.jumping;
			var oldPos = that.position;

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
			world.blocks.forEach(function(block) {
				var collision = collisionCheck(that, block);
				
				if (collision === 'left' || collision === 'right') {
					that.velX = 0;
					that.jumping = false;
				} else if (collision === 'bottom') {
					that.grounded = true;
					that.jumping = false;
				} else if (collision === 'top') {
					that.velY *= -(GRAVITY*(1/90));
				}
			});
			if (that.grounded) that.velY = 0;

			var newX = Math.floor(that.x);
			var newY = Math.floor(that.y);
			var newJumping = that.jumping;

			if (newX > oldX) that.position = 'run-right';
			if (newX < oldX) that.position = 'run-left';
			if (newX === oldX && that.position === 'run-left') that.position = 'stand-left';
			if (newX === oldX && that.position === 'run-right') that.position = 'stand-right';

			if (that.position in {'run-left':1, 'stand-left':1} && that.jumping) that.position = 'jump-left';
			if (that.position in {'run-right':1, 'stand-right':1} && that.jumping) that.position = 'jump-right';

			if (oldJumping && !newJumping && oldPos === 'jump-left') that.position = 'stand-left';
			if (oldJumping && !newJumping && oldPos === 'jump-right') that.position = 'stand-right';

			var newPos = that.position;
			if (oldPos !== newPos) {
				that.sprite.time = 0;
				that.sprite.frame = 0;
			}
			if (oldPos === newPos) {
				that.sprite.time += dt;
				if (that.sprite.time > 0.03) {
					that.sprite.time = 0;
					that.sprite.frame = that.sprite.frame === frames[that.position].length-1 ? 0 : that.sprite.frame+1;
				}
			}

			dt = 0;
		};

		return that;
	};
};