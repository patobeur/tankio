let _Rectangle = (function () {

	function sin(x) {
		return Math.sin(x / 180 * Math.PI);
	}

	function cos(x) {
		return Math.cos(x / 180 * Math.PI);
	}

	function getVectorLength(x, y, width, height) {
		var center = {
			x: x + width / 2,
			y: y + height / 2
		};
		//console.log('center: ',center);
		var vector = {
			x: (x - center.x),
			y: (y - center.y)
		};
		return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	}

	function getRotatedTopLeftCornerOfRect(x, y, width, height, angle) {
		var center = {
			x: x + width / 2,
			y: y + height / 2
		};
		//console.log('center: ',center);
		var vector = {
			x: (x - center.x),
			y: (y - center.y)
		};
		//console.log('vector: ',vector);
		var rotationMatrix = [[cos(angle), -sin(angle)], [sin(angle), cos(angle)]];
		//console.log('rotationMatrix: ',rotationMatrix);
		var rotatedVector = {
			x: vector.x * rotationMatrix[0][0] + vector.y * rotationMatrix[0][1],
			y: vector.x * rotationMatrix[1][0] + vector.y * rotationMatrix[1][1]
		};
		//console.log('rotatedVector: ',rotatedVector);
		return {
			x: (center.x + rotatedVector.x),
			y: (center.y + rotatedVector.y)
		};
	}

	function getOffset(el) {
		var _x = 0;
		var _y = 0;
		while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return {
			top: _y,
			left: _x
		};
	}

	function pointInPoly(verties, testx, testy) {
		var i,
			j,
			c = 0
		nvert = verties.length;
		for (i = 0, j = nvert - 1; i < nvert; j = i++) {
			if (((verties[i].y > testy) != (verties[j].y > testy)) && (testx < (verties[j].x - verties[i].x) * (testy - verties[i].y) / (verties[j].y - verties[i].y) + verties[i].x))
				c = !c;
		}
		return c;
	}

	function Rectangle(htmlElement, width, height, angle, name, number) {
		this.htmlElement = htmlElement;
		this.width = width;
		this.height = height;
		this.name = name + '_' + number
		this.number = new Number(number)
		this.setCorners(angle);
	}

	function testCollision(rectangle) {
		var collision = false;
		this.getCorners().forEach(function (corner) {
			var isCollided = pointInPoly(rectangle.getCorners(), corner.x, corner.y);
			if (isCollided) collision = true;
		});
		return collision;
	}

	function checkRectangleCollision(rect, rect2) {
		if (testCollision.call(rect, rect2)) return true;
		else if (testCollision.call(rect2, rect)) return true;
		return false;
	}

	function getAngleForNextCorner(anc, vectorLength) {
		var alpha = Math.acos(anc / vectorLength) * (180 / Math.PI);
		return 180 - alpha * 2;
	}

	Rectangle.prototype.setCorners = function (angle) {
		this.originalPos = getOffset(this.htmlElement);
		this.leftTopCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

		var vecLength = getVectorLength(this.originalPos.left, this.originalPos.top, this.width, this.height);
		//console.log('vecLength: ',vecLength);

		angle = angle + getAngleForNextCorner(this.width / 2, vecLength);
		//console.log('angle: ',angle);
		this.rightTopCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

		angle = angle + getAngleForNextCorner(this.height / 2, vecLength);
		//console.log('angle: ',angle);
		this.rightBottomCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

		angle = angle + getAngleForNextCorner(this.width / 2, vecLength);
		//console.log('angle: ',angle);
		this.leftBottomCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

		//console.log(this);
	};

	Rectangle.prototype.getCorners = function () {
		return [this.leftTopCorner,
		this.rightTopCorner,
		this.rightBottomCorner,
		this.leftBottomCorner];
	};

	Rectangle.prototype.isCollided = function (rectangle) {
		return checkRectangleCollision(this, rectangle);
	};

	return Rectangle;

})();

let _checkcollision = function (htmlRectA, htmlRectB) {
	let RotateA = parseFloat(htmlRectA.style.transform.replace(/rotate\(|deg\)/g, ''));
	let RotateB = parseFloat(htmlRectB.style.transform.replace(/rotate\(|deg\)/g, ''));
	rectA.setCorners(RotateA);
	rectB.setCorners(RotateB);
	if (rectA.isCollided(rectB)) {
		console.log('Collision detected')
		// msgDiv.innerHTML = 'Collision detected!';
		// msgDiv.setAttribute('style', 'color: #FF0000');

		return true
	}
	else {
		// msgDiv.innerHTML = 'No Collision!';
		// msgDiv.setAttribute('style', 'color: #000000');
		return false
	}
}

export { _Rectangle, _checkcollision }
