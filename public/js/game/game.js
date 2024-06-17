"use strict";
import { _board, _console, _names, _front } from './board.js'
import { Rectangle, _checkcollision } from './rectangle.js'
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
const _game = {
	user: undefined,
	users: [],
	start: undefined,
	userDiv: {},
	usersDiv: {},
	tchatActive: false,
	physicBodies: [],
	init: function (user, users, map) {
		this.user = user;
		this.users = users;
		this.map = map

		this.addMapsElement()

		this.add_BlocsToMap()

		_keyboard.init(this.user.datas)


		this.startAnimation()
	},
	checkcollision2: function (RectA, RectB) {
		let RotateA = 10;//parseFloat(RectA.htmlElement.style.transform.replace(/rotate\(|deg\)/g, ''));
		let RotateB = parseFloat(RectB.htmlElement.style.transform.replace(/rotate\(|deg\)/g, ''));

		console.log(RotateA)
		RectA.setCorners(RotateA);
		RectB.setCorners(RotateB);
		if (RectA.isCollided(RectB)) {
			console.log('------------Collision detected-------------------')
			// msgDiv.innerHTML = 'Collision detected!';
			// msgDiv.setAttribute('style', 'color: #FF0000');
			return true
		}
		else {
			return false
			// msgDiv.innerHTML = 'No Collision!';
			// msgDiv.setAttribute('style', 'color: #000000');
		}
	},
	checkcollision: function () {
		this.physicBodies.forEach(element => {
			let colliding = this.checkcollision2(this.userDiv['player'], element)
			if (colliding) return true
		});
		return false
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
		this.addPlayerElement()



		window.addEventListener("resize", (event) => {
			this.setMapPos()
		});
	},
	addPlayerElement: function () {
		this.userDiv['player'] = _front.createDiv({
			tag: 'div', attributes: { className: 'player' }, style: {
				backgroundColor: this.user.datas.clientDatas.color, width: this.user.datas.size.w + 'px', height: this.user.datas.size.h + 'px'
			}
		})


		this.userDiv['player'] = new Rectangle(this.userDiv['player'], this.user.datas.size.w, this.user.datas.size.h, 0, 'player', this.physicBodies.length);
		// this.physicBodies.push(this.userDiv['player'])


		this.userDiv['playersZone'].appendChild(this.userDiv['player'].htmlElement)
	},
	add_BlocsToMap: function () {
		// this.mapElements['player'] = _front.createDiv({ tag: 'div', attributes: { className: 'player' }, style: { width: this.user.datas.size.w + 'px', height: this.user.datas.size.h + 'px' } })


		if (this.map.blocs && this.map.blocs.invisibleWalls) {

			this.map.blocs.invisibleWalls.forEach(element => {

				let newEle = _front.createDiv({
					tag: 'div', attributes: { className: 'wall' }, style: {
						position: 'absolute', outline: '1px solid red',
						left: (element.x - (element.w / 2)) + 'px', top: (element.y - (element.h / 2)) + 'px',
						width: element.w + 'px', height: element.h + 'px',
						transform: `rotate(${element.r}deg)`
					}
				})

				newEle = new Rectangle(newEle, element.w, element.h, element.r, 'wall', this.physicBodies.length + 1);
				this.physicBodies.push(newEle)
				this.userDiv['map'].appendChild(newEle.htmlElement)

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


		this.checkcollision()

		this.userDiv['playerpos'].textContent = `x:${this.user.datas.pos.x + (this.map.w / 2)} y:${this.user.datas.pos.y + (this.map.h / 2)}`
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
