const Rectangle = (
	function () {
		function Rectangle(htmlElement) {
			let angle = 0, transform = false

			this.htmlElement = htmlElement;
			this.width = htmlElement.clientWidth;
			this.height = htmlElement.clientHeight;

			if (typeof htmlElement.style.transform === 'string' && htmlElement.style.transform != '') {
				transform = parseFloat(htmlElement.style.transform.replace(/rotate\(|deg\)/g, ''));
				angle = transform ?? 0;
			}
			this.angle = angle
			this.setCorners(angle);
			console.log('Rectangle', this)
		}

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
			var i, j, c = 0;
			var nvert = verties.length;
			for (i = 0, j = nvert - 1; i < nvert; j = i++) {
				if (((verties[i].y > testy) != (verties[j].y > testy)) && (testx < (verties[j].x - verties[i].x) * (testy - verties[i].y) / (verties[j].y - verties[i].y) + verties[i].x))
					c = !c;
			}
			return c;
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

			// console.log(this);
		};

		Rectangle.prototype.getCorners = function () {
			return [this.leftTopCorner, this.rightTopCorner, this.rightBottomCorner, this.leftBottomCorner];
		};

		Rectangle.prototype.isCollided = function (rectangle) {
			return checkRectangleCollision(this, rectangle);
		};
		return Rectangle;
	}
)();

function checkCollisions(A, B) {
	A.setCorners(A.angle);
	B.setCorners(B.angle);
	if (A.isCollided(B)) return true;
	return false
}
export { Rectangle, checkCollisions }
