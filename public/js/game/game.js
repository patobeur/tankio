"use strict";
import { _board, _console, _names, _front } from './board.js'
let _keyboard = {
	move: { x: 0, y: 0 },
	actions: { moveForward: false, moveBackward: false, moveLeft: false, moveRight: false, },
	keyMap: {
		KeyW: false,
		KeyS: false,
		KeyA: false,
		KeyD: false,
		KeyQ: false,
		KeyE: false,
		Space: false,
		ArrowRight: false,
		ArrowLeft: false,
		ArrowUp: false,
		ArrowDown: false,
	},
	onDocumentKey: function (e) {
		if (_game.tchatActive === false) {
			if (e.type === "keydown" || e.type === "keyup") {
				_keyboard.keyMap[e.code] = e.type === "keydown";
			}
			_keyboard.actions.moveForward = (_keyboard.keyMap["KeyW"] || _keyboard.keyMap["ArrowUp"]);
			_keyboard.actions.moveBackward = (_keyboard.keyMap["KeyS"] || _keyboard.keyMap["ArrowDown"]);
			_keyboard.actions.moveLeft = (_keyboard.keyMap["KeyA"] || _keyboard.keyMap["ArrowLeft"]);
			_keyboard.actions.moveRight = (_keyboard.keyMap["KeyD"] || _keyboard.keyMap["ArrowRight"]);

			// console.log('this.actions', e.code)
			_keyboard.checkMooves()
		}
	},
	checkMooves: function () {
		_keyboard.move = { x: 0, y: 0 }
		_keyboard.actions.ismoving = false
		if (_keyboard.actions.moveForward) { _keyboard.move.y = - 1; _keyboard.actions.ismoving = true; }
		if (_keyboard.actions.moveBackward) { _keyboard.move.y = 1; _keyboard.actions.ismoving = true; }
		if (_keyboard.actions.moveLeft) { _keyboard.move.x = - 1; _keyboard.actions.ismoving = true; }
		if (_keyboard.actions.moveRight) { _keyboard.move.x = 1; _keyboard.actions.ismoving = true; }

		// let futurX = _game.user.datas.pos.x + _keyboard.move.x
		// let futurY = _game.user.datas.pos.y + _keyboard.move.y

		// if (futurX >= maxX) {
		// 	console.log('out > X')
		// 	console.log(futurX, futurY)
		// 	_keyboard.move.x = 0
		// }
		// if (!(futurX < maxX && futurX > minX)) {
		// 	console.log('out X')
		// 	console.log(futurX, futurY)
		// 	_keyboard.move.x = 0
		// }
		// if (!(futurY < maxY && futurY > minY)) {
		// 	console.log('out Y')
		// 	console.log(futurX, futurY)
		// 	_keyboard.move.y = 0
		// }

	},
	init: function () {
		document.addEventListener("keydown", this.onDocumentKey, true);
		document.addEventListener("keyup", this.onDocumentKey, true);
	},
}
// const Rectangle = (
// 	function () {
// 		function Rectangle(htmlElement) {
// 			let angle = 0, transform = false

// 			this.htmlElement = htmlElement;
// 			this.width = htmlElement.clientWidth;
// 			this.height = htmlElement.clientHeight;

// 			if (typeof htmlElement.style.transform === 'string' && htmlElement.style.transform != '') {
// 				transform = parseFloat(htmlElement.style.transform.replace(/rotate\(|deg\)/g, ''));
// 				angle = transform ?? 0;
// 			}
// 			this.angle = angle
// 			this.setCorners(angle);
// 			console.log('Rectangle', this)
// 		}

// 		function sin(x) {
// 			return Math.sin(x / 180 * Math.PI);
// 		}

// 		function cos(x) {
// 			return Math.cos(x / 180 * Math.PI);
// 		}

// 		function getVectorLength(x, y, width, height) {
// 			var center = {
// 				x: x + width / 2,
// 				y: y + height / 2
// 			};
// 			//console.log('center: ',center);
// 			var vector = {
// 				x: (x - center.x),
// 				y: (y - center.y)
// 			};
// 			return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
// 		}

// 		function getRotatedTopLeftCornerOfRect(x, y, width, height, angle) {
// 			var center = {
// 				x: x + width / 2,
// 				y: y + height / 2
// 			};
// 			//console.log('center: ',center);
// 			var vector = {
// 				x: (x - center.x),
// 				y: (y - center.y)
// 			};
// 			//console.log('vector: ',vector);
// 			var rotationMatrix = [[cos(angle), -sin(angle)], [sin(angle), cos(angle)]];
// 			//console.log('rotationMatrix: ',rotationMatrix);
// 			var rotatedVector = {
// 				x: vector.x * rotationMatrix[0][0] + vector.y * rotationMatrix[0][1],
// 				y: vector.x * rotationMatrix[1][0] + vector.y * rotationMatrix[1][1]
// 			};
// 			//console.log('rotatedVector: ',rotatedVector);
// 			return {
// 				x: (center.x + rotatedVector.x),
// 				y: (center.y + rotatedVector.y)
// 			};
// 		}

// 		function getOffset(el) {
// 			var _x = 0;
// 			var _y = 0;
// 			while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
// 				_x += el.offsetLeft - el.scrollLeft;
// 				_y += el.offsetTop - el.scrollTop;
// 				el = el.offsetParent;
// 			}
// 			return {
// 				top: _y,
// 				left: _x
// 			};
// 		}

// 		function pointInPoly(verties, testx, testy) {
// 			var i,
// 				j,
// 				c = 0
// 			nvert = verties.length;
// 			for (i = 0, j = nvert - 1; i < nvert; j = i++) {
// 				if (((verties[i].y > testy) != (verties[j].y > testy)) && (testx < (verties[j].x - verties[i].x) * (testy - verties[i].y) / (verties[j].y - verties[i].y) + verties[i].x))
// 					c = !c;
// 			}
// 			return c;
// 		}

// 		function testCollision(rectangle) {
// 			var collision = false;
// 			this.getCorners().forEach(function (corner) {
// 				var isCollided = pointInPoly(rectangle.getCorners(), corner.x, corner.y);
// 				if (isCollided) collision = true;
// 			});
// 			return collision;
// 		}

// 		function checkRectangleCollision(rect, rect2) {
// 			if (testCollision.call(rect, rect2)) return true;
// 			else if (testCollision.call(rect2, rect)) return true;
// 			return false;
// 		}

// 		function getAngleForNextCorner(anc, vectorLength) {
// 			var alpha = Math.acos(anc / vectorLength) * (180 / Math.PI);
// 			return 180 - alpha * 2;
// 		}

// 		Rectangle.prototype.setCorners = function (angle) {
// 			this.originalPos = getOffset(this.htmlElement);
// 			this.leftTopCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

// 			var vecLength = getVectorLength(this.originalPos.left, this.originalPos.top, this.width, this.height);
// 			//console.log('vecLength: ',vecLength);

// 			angle = angle + getAngleForNextCorner(this.width / 2, vecLength);
// 			//console.log('angle: ',angle);
// 			this.rightTopCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

// 			angle = angle + getAngleForNextCorner(this.height / 2, vecLength);
// 			//console.log('angle: ',angle);
// 			this.rightBottomCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

// 			angle = angle + getAngleForNextCorner(this.width / 2, vecLength);
// 			//console.log('angle: ',angle);
// 			this.leftBottomCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

// 			// console.log(this);
// 		};

// 		Rectangle.prototype.getCorners = function () {
// 			return [this.leftTopCorner, this.rightTopCorner, this.rightBottomCorner, this.leftBottomCorner];
// 		};

// 		Rectangle.prototype.isCollided = function (rectangle) {
// 			return checkRectangleCollision(this, rectangle);
// 		};
// 		return Rectangle;
// 	}
// )();

// function checkCollisions(A, B) {
// 	A.setCorners(A.angle);
// 	B.setCorners(B.angle);
// 	if (A.isCollided(B)) return true;
// 	return false
// }

const _game = {
	user: undefined,
	users: [],
	start: undefined,
	userDiv: {},
	usersDiv: {},
	tchatActive: false,
	physicBodies: [],
	init: function (user, users, map, newPlayerPositionCallback) {
		this.newPlayerPositionCallback = newPlayerPositionCallback;
		this.user = user;
		this.users = users;
		this.map = map

		this.addMapsElement()

		this.add_BlocsToMap()

		// this.addOtherPlayersElement()

		this.addPlayerElement()
		_keyboard.init(this.user.datas)


		this.startAnimation()
	},
	refresh_roomers: function (paquet) {
		this.users = paquet.users
		let freshOnlineId = {}
		if (this.users.length > 1) {



			this.users.forEach(oUser => {
				if (this.user.id != oUser.id) { // si ce n'est pas nous !!
					if (typeof this.usersDiv[oUser.id] === 'undefined') { // si il n'existe pas !

						console.log('addOtherPlayersElement:', oUser)

						this.usersDiv[oUser.id] = _front.createDiv({
							tag: 'div', attributes: { className: 'mates', title: oUser.name },
							style: {
								left: ((this.map.w / 2) + oUser.datas.pos.x - (oUser.datas.size.w / 2)) + 'px',
								top: ((this.map.h / 2) + oUser.datas.pos.y - (oUser.datas.size.h / 2)) + 'px',
								position: 'absolute',
								borderRadius: '50%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: oUser.datas.clientDatas.color,
								width: oUser.datas.size.w + 'px', height: oUser.datas.size.h + 'px'
							}
						})
						this.userDiv['map'].appendChild(this.usersDiv[oUser.id])
						freshOnlineId[oUser.id] = oUser

					}
					else {// allready existe !
						this.usersDiv[oUser.id].style.left = ((this.map.w / 2) + oUser.datas.pos.x - (oUser.datas.size.w / 2)) + 'px'
						this.usersDiv[oUser.id].style.top = ((this.map.h / 2) + oUser.datas.pos.y - (oUser.datas.size.h / 2)) + 'px'
					}
				}
			});

			// for (const key in this.usersDiv) {
			// 	const element = this.usersDiv[key];
			// 	console.log('actual:', element)

			// 	console.log('this.users[key]:', key)
			// 	// TODO 				// TODO
			// 	// TODO 				// TODO
			// 	// TODO 				// TODO
			// 	if (typeof freshOnlineId[key] === 'undefined') {
			// 		this.usersDiv[key].textContent = '☠️'
			// 		this.usersDiv[key].backgroundColor = 'none'
			// 		this.usersDiv[key].classList.add('outline')
			// 	}



			// }
		}

	},
	addMapsElement: function () {
		this.userDiv['playerpos'] = _front.createDiv({ tag: 'div', attributes: { className: 'player-pos', textContent: `x:${this.user.datas.pos.x} y:${this.user.datas.pos.y}` }, style: {} })


		this.userDiv['playersZone'] = _front.createDiv({ tag: 'div', attributes: { className: 'players-zone' }, style: {} })

		this.userDiv['mapZone'] = _front.createDiv({ tag: 'div', attributes: { className: 'map-zone' }, style: {} })
		this.userDiv['map'] = _front.createDiv({
			tag: 'div', attributes: { title: 'this.map.name', className: 'map' }, style: {
				position: 'absolute', width: this.map.w + 'px', height: this.map.h + 'px',
				backgroundImage: `url(/assets/${this.map.src})`
			}
		})
		this.userDiv['mapZone'].appendChild(this.userDiv['map'])


		this.userDiv['playersZone'].appendChild(this.userDiv['mapZone'])
		this.userDiv['playersZone'].appendChild(this.userDiv['playerpos'])

		document.body.appendChild(this.userDiv['playersZone'])
		this.setMapPos()



		window.addEventListener("resize", (event) => {
			this.setMapPos()
		});
	},
	addPlayerElement: function () {
		this.userDiv['player'] = _front.createDiv({
			tag: 'div', attributes: { className: 'player', title: this.user.name },
			style: {
				left: ((this.map.w / 2) + this.user.datas.pos.x - (this.user.datas.size.w / 2)) + 'px',
				top: ((this.map.h / 2) + this.user.datas.pos.y - (this.user.datas.size.h / 2)) + 'px',
				position: 'absolute',
				borderRadius: '50%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: this.user.datas.clientDatas.color,
				width: this.user.datas.size.w + 'px', height: this.user.datas.size.h + 'px'
			}
		})
		this.userDiv['map'].appendChild(this.userDiv['player'])
	},
	add_BlocsToMap: function () {
		if (this.map.blocs && this.map.blocs.invisibleWalls) {
			this.map.blocs.invisibleWalls.forEach(element => {
				let newBloc = _front.createDiv({
					tag: 'div', attributes: { className: 'wall' }, style: {
						position: 'absolute', outline: '1px solid red',
						left: (element.x - (element.w / 2)) + 'px', top: (element.y - (element.h / 2)) + 'px',
						width: element.w + 'px', height: element.h + 'px',
						transform: `rotate(${element.r}deg)`
					}
				})
				// newBloc = new Rectangle(newBloc);
				// this.physicBodies.push(newBloc)
				// this.userDiv['map'].appendChild(newBloc.htmlElement)
				this.userDiv['map'].appendChild(newBloc)
			});
		}
	},
	checkPlayerPos: function () {
		let maxX = (this.map.w / 2) // - (_game.user.datas.size.w / 2)
		let minX = -(this.map.w / 2) // + (_game.user.datas.size.w / 2)
		let maxY = (this.map.h / 2) // - (_game.user.datas.size.h / 2)
		let minY = -(this.map.h / 2) // + (_game.user.datas.size.h / 2)

		let futurX = _game.user.datas.pos.x + _keyboard.move.x
		let futurY = _game.user.datas.pos.y + _keyboard.move.y

		if (futurX >= maxX || futurX <= minX) { _keyboard.move.x = 0 }
		if (futurY >= maxY || futurY <= minY) { _keyboard.move.y = 0 }

		this.user.datas.pos.y += _keyboard.move.y
		this.user.datas.pos.x += _keyboard.move.x

		let px = (this.map.w / 2) + this.user.datas.pos.x - (this.user.datas.size.w / 2)
		let py = (this.map.h / 2) + this.user.datas.pos.y - (this.user.datas.size.h / 2)

		this.userDiv['player'].style.left = px + "px"
		this.userDiv['player'].style.top = py + "px"

		this.userDiv['playerpos'].textContent = `x:${this.user.datas.pos.x + (this.map.w / 2)} y:${this.user.datas.pos.y + (this.map.h / 2)}`

		this.newPlayerPositionCallback(this.user)
	},
	setMapPos: function () {

		let x = Math.floor((this.userDiv['mapZone'].clientWidth / 2) - (this.map.w / 2) - this.user.datas.pos.x)
		let y = Math.floor((this.userDiv['mapZone'].clientHeight / 2) - (this.map.h / 2) - this.user.datas.pos.y)
		this.userDiv['map'].style.transform = "translate(" + x + "px," + y + "px)";
	},
	startAnimation: function () {
		this.update = setInterval(
			() => {
				if (_keyboard.actions.ismoving) {
					this.checkPlayerPos()
					this.setMapPos()
				}
			},
			15
		)
	}
};
export { _game }
