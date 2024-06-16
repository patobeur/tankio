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
		if (e.type === "keydown" || e.type === "keyup") {
			_keyboard.keyMap[e.code] = e.type === "keydown";
		}
		// if (this.pointerLocked) {
		_keyboard.actions.moveForward = (_keyboard.keyMap["KeyW"] || _keyboard.keyMap["ArrowUp"]);
		_keyboard.actions.moveBackward = (_keyboard.keyMap["KeyS"] || _keyboard.keyMap["ArrowDown"]);
		_keyboard.actions.moveLeft = (_keyboard.keyMap["KeyA"] || _keyboard.keyMap["ArrowLeft"]);
		_keyboard.actions.moveRight = (_keyboard.keyMap["KeyD"] || _keyboard.keyMap["ArrowRight"]);

		// console.log('this.actions', e.code)
		_keyboard.checkMooves()
		// }
	},
	checkMooves: function () {
		_keyboard.move = { x: 0, y: 0 }
		_keyboard.actions.ismoving = false
		if (_keyboard.actions.moveForward) { _keyboard.move.y = - 1; _keyboard.actions.ismoving = true; }
		if (_keyboard.actions.moveBackward) { _keyboard.move.y = 1; _keyboard.actions.ismoving = true; }
		if (_keyboard.actions.moveLeft) { _keyboard.move.x = - 1; _keyboard.actions.ismoving = true; }
		if (_keyboard.actions.moveRight) { _keyboard.move.x = 1; _keyboard.actions.ismoving = true; }

		let maxX = (_game.user.datas.map.w / 2) // - (_game.user.datas.size.w / 2)
		let minX = -(_game.user.datas.map.w / 2) // + (_game.user.datas.size.w / 2)
		let maxY = (_game.user.datas.map.h / 2) // - (_game.user.datas.size.h / 2)
		let minY = -(_game.user.datas.map.h / 2) // + (_game.user.datas.size.h / 2)

		let futurX = _game.user.datas.pos.x + _keyboard.move.x
		let futurY = _game.user.datas.pos.y + _keyboard.move.y
		console.log(futurX)
		console.log(futurY)
		if (!(futurX < maxX && futurX > minX)) {
			_keyboard.move.x = 0
		}
		if (!(futurY < maxY && futurY > minY)) {
			_keyboard.move.y = 0
		}

	},
	init: function () {
		document.addEventListener("keydown", this.onDocumentKey, true);
		document.addEventListener("keyup", this.onDocumentKey, true);
	},
}
const _game = {
	user: undefined,
	users: undefined,
	start: undefined,
	userDiv: {},
	tchatActive: false,
	init: function (user, users) {
		this.user = user;
		this.users = users;

		this.map = this.user.datas.map

		this.addMapsElement()
		_keyboard.init(this.user.datas)
		this.startAnimation()
	},
	addMapsElement: function () {
		this.userDiv['player'] = _front.createDiv({ tag: 'div', attributes: { className: 'player' }, style: { width: this.user.datas.size.w + 'px', height: this.user.datas.size.h + 'px' } })

		this.userDiv['playersZone'] = _front.createDiv({ tag: 'div', attributes: { className: 'players-zone' }, style: {} })


		this.userDiv['mapZone'] = _front.createDiv({ tag: 'div', attributes: { className: 'map-zone' }, style: {} })
		this.userDiv['map_0'] = _front.createDiv({
			tag: 'div', attributes: { className: 'map' }, style: {
				position: 'absolute', width: this.map.w + 'px', height: this.map.h + 'px'
			}
		})

		this.userDiv['mapZone'].appendChild(this.userDiv['map_0'])


		this.userDiv['playersZone'].appendChild(this.userDiv['mapZone'])
		this.userDiv['playersZone'].appendChild(this.userDiv['player'])

		document.body.appendChild(this.userDiv['playersZone'])


		this.setMapPos()

		window.addEventListener("resize", (event) => {
			this.setMapPos()
		});
	},
	setPlayerPos: function () {
		this.user.datas.pos.y += _keyboard.move.y
		this.user.datas.pos.x += _keyboard.move.x
		this.setMapPos()
	},
	setMapPos: function () {
		let x = Math.floor((this.userDiv['mapZone'].clientWidth / 2) - (this.map.w / 2) - this.user.datas.pos.x)
		let y = Math.floor((this.userDiv['mapZone'].clientHeight / 2) - (this.map.h / 2) - this.user.datas.pos.y)
		this.userDiv['map_0'].style.transform = "translate(" + x + "px," + y + "px)";
	},
	startAnimation: function () {
		this.update = setInterval(
			() => {
				if (_keyboard.actions.ismoving) {
					console.log('coucou')
					this.setPlayerPos()
				}
			},
			10
		)
	}
};
export { _game }
