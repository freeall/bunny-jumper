module.exports = function(shapeA, shapeB) {
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
