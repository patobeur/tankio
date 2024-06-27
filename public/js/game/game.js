"use strict";
import { _board, _console, _names, _front } from './board.js'
import { _physics } from './physicsok.js'
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
	blocsDiv: {},
	tchatActive: false,
	physicBodies: [],
	OldUsersIndex: {},
	init: function (user, users, map, newPlayerPositionCallback, testsDevDatas) {
		this.newPlayerPositionCallback = newPlayerPositionCallback;
		this.user = user;
		this.users = users;
		this.map = map
		this.addMapsElement()
		this.add_BlocsToMap()
		this.addPlayerElement()
		_keyboard.init(this.user.datas)
		this.startAnimation()
	},
	refresh_roomers: function (paquet) {
		// console.log('refresh_roomers')
		this.users = paquet.users
		let NewUsersIndex = {}

		if (this.users.length > 1) {
			this.users.forEach(user => {
				if (this.user.id != user.id) { // si ce n'est pas nous !!
					if (typeof this.usersDiv[user.id] === 'undefined') { // si il n'existe pas !
						this.usersDiv[user.id] = _front.createDiv({
							recenter: true,
							tag: 'div', attributes: { className: 'mates', title: user.name },
							style: {
								left: (user.datas.pos.x) + 'px',
								top: (user.datas.pos.y) + 'px',
								position: 'absolute',
								width: user.datas.size.w + 'px',
								height: user.datas.size.h + 'px'
							}
						})
						this.userDiv[user.id + 'Char'] = _front.createDiv({
							tag: 'div', attributes: {
								className: 'charactere'
							},
							style: {
								width: user.datas.size.w + 'px',
								height: user.datas.size.h + 'px',
								backgroundColor: user.datas.clientDatas.color,
							}
						})
						this.userDiv[user.id + 'Zone'] = _front.createDiv({
							tag: 'div', attributes: {
								className: 'zone'
							},
							style: {
								backgroundColor: "red",
								width: '30px',
								height: '30px',
							}
						})
						this.usersDiv[user.id].appendChild(this.userDiv[user.id + 'Zone'])
						this.usersDiv[user.id].appendChild(this.userDiv[user.id + 'Char'])
						this.userDiv['map'].appendChild(this.usersDiv[user.id])
					}
					else {// allready existe !
						this.usersDiv[user.id].style.left = (user.datas.pos.x - (user.datas.size.w / 2)) + 'px'
						this.usersDiv[user.id].style.top = (user.datas.pos.y - (user.datas.size.h / 2)) + 'px'
					}
					NewUsersIndex[user.id] = user.id
				}
			});


		}
		for (const id in this.OldUsersIndex) {
			// console.log(this.usersDiv[id])
			if (typeof NewUsersIndex[id] === 'undefined') {
				this.usersDiv[id].textContent = '☠️'
				this.usersDiv[id].backgroundColor = 'none'
				this.usersDiv[id].classList.add('disconnected')
				setInterval(() => {
					this.usersDiv[id].remove()
				}, 10000)
			}
		}
		this.OldUsersIndex = NewUsersIndex

	},
	addMapsElement: function () {
		this.userDiv['playerpos'] = _front.createDiv({ tag: 'div', attributes: { className: 'player-pos', textContent: `x:${this.user.datas.pos.x} y:${this.user.datas.pos.y}` }, style: {} })
		this.userDiv['playersZone'] = _front.createDiv({ tag: 'div', attributes: { className: 'players-zone' }, style: {} })
		this.userDiv['mapZone'] = _front.createDiv({ tag: 'div', attributes: { className: 'map-zone' }, style: {} })
		this.userDiv['map'] = _front.createDiv({
			tag: 'div', attributes: { title: this.map.name, className: 'map' }, style: {
				position: 'absolute', width: this.map.w + 'px', height: this.map.h + 'px',
				backgroundImage: `url(/assets/${this.map.src})`
			}
		})
		this.userDiv['mapZone'].appendChild(this.userDiv['map'])
		this.userDiv['playersZone'].appendChild(this.userDiv['mapZone'])
		this.userDiv['playersZone'].appendChild(this.userDiv['playerpos'])

		this.userDiv['resizeMap'] = _front.createDiv({ tag: 'div', attributes: { className: 'resize-map', textContent: `🖥️` }, style: {} })
		this.userDiv['resizeMap'].addEventListener('click', () => {
			this.userDiv['playersZone'].classList = "players-zone full"
			this.setMapPos()
		})
		this.userDiv['playersZone'].appendChild(this.userDiv['resizeMap'])

		document.body.appendChild(this.userDiv['playersZone'])
		this.setMapPos()
		window.addEventListener("resize", (event) => {
			this.setMapPos()
		});
	},
	addPlayerElement: function () {
		this.userDiv['player'] = new _physics.Rectangle(
			_front.createDiv({
				recenter: true,
				tag: 'div', attributes: { className: 'player', title: this.user.name },
				style: (this.user && this.user.datas && this.user.datas.clientDatas) ? {
					left: (this.user.datas.pos.x) + 'px',
					top: (this.user.datas.pos.y) + 'px',
					position: 'absolute',
					width: this.user.datas.size.w + 'px',
					height: this.user.datas.size.h + 'px',
				} : {}
			}),
			false
		);
		this.userDiv['playerChar'] = _front.createDiv({
			tag: 'div', attributes: { className: 'charactere' },
			style: {
				backgroundColor: this.user.datas.clientDatas.color,
				width: this.user.datas.size.w + 'px',
				height: this.user.datas.size.h + 'px',
			}
		})
		this.userDiv['playerZone'] = _front.createDiv({
			tag: 'div', attributes: { className: 'zone' },
			style: {
				backgroundColor: this.user.datas.clientDatas.color,
				width: '30px',
				height: '30px',
			}
		})
		this.userDiv['player'].htmlElement.appendChild(this.userDiv['playerZone'])
		this.userDiv['player'].htmlElement.appendChild(this.userDiv['playerChar'])
		this.userDiv['map'].appendChild(this.userDiv['player'].htmlElement)
	},
	add_BlocsToMap: function () {
		if (this.map.blocs && this.map.blocs.invisibleWalls) {
			this.map.blocs.invisibleWalls.forEach(element => {
				let newBloc = new _physics.Rectangle(_front.createDiv({
					recenter: true,
					tag: 'div', attributes: { className: 'wall' }, style: {
						position: 'absolute', outline: '1px solid red',
						left: (element.x) + 'px', top: (element.y) + 'px',
						width: element.w + 'px', height: element.h + 'px',
						transform: `rotate(${element.r}deg)`
					}
				}), true)

				this.blocsDiv[newBloc.htmlElement.dataId] = newBloc
				this.userDiv['map'].appendChild(newBloc.htmlElement)
			});
		}
	},
	checkPlayerPos: function () {
		let maxX = (this.map.w) // - (_game.user.datas.size.w / 2)
		let minX = 0 // + (_game.user.datas.size.w / 2)
		let maxY = (this.map.h) // - (_game.user.datas.size.h / 2)
		let minY = 0 // + (_game.user.datas.size.h / 2)

		let futurX = _game.user.datas.pos.x + _keyboard.move.x
		let futurY = _game.user.datas.pos.y + _keyboard.move.y

		if (futurX >= maxX || futurX <= minX) { _keyboard.move.x = 0 }
		if (futurY >= maxY || futurY <= minY) { _keyboard.move.y = 0 }

		// this.user.datas.pos.y += _keyboard.move.y
		// this.user.datas.pos.x += _keyboard.move.x

		// let px = this.user.datas.pos.x
		// let py = this.user.datas.pos.y

		// // positionnemement sur la map
		// this.userDiv['player'].htmlElement.style.left = px - (this.user.datas.size.w / 2) + "px"
		// this.userDiv['player'].htmlElement.style.top = py - (this.user.datas.size.h / 2) + "px"

		// this.userDiv['playerpos'].textContent = `x:${px} y:${py}`

	},
	refreshPlayerPos: function (deltaTime = 0.01, collisions) {
		if (collisions > 0) {
			_game.user.datas.pos.y = _game.user.datas.posOld.y
			_game.user.datas.pos.x = _game.user.datas.posOld.x
			this.userDiv['player'].htmlElement.style.left = _game.user.datas.pos.x - (_game.user.datas.size.w / 2) + "px"
			this.userDiv['player'].htmlElement.style.top = _game.user.datas.pos.y - (_game.user.datas.size.h / 2) + "px"
		}
		else {
			_game.user.datas.posOld = { x: _game.user.datas.pos.x, y: _game.user.datas.pos.y }

			_game.user.datas.pos.y += (_keyboard.move.y * deltaTime * 100)
			_game.user.datas.pos.x += (_keyboard.move.x * deltaTime * 100)

			// positionnemement sur la map
			this.userDiv['player'].htmlElement.style.left = _game.user.datas.pos.x - (_game.user.datas.size.w / 2) + "px"
			this.userDiv['player'].htmlElement.style.top = _game.user.datas.pos.y - (_game.user.datas.size.h / 2) + "px"

			this.userDiv['playerpos'].textContent = `x:${this.user.datas.pos.x} y:${this.user.datas.pos.y}`
		}
		this.newPlayerPositionCallback(this.user)

	},
	checkcollisionCallback: (element) => {
		// element.htmlElement.style.transform = 'rotate(' + (element.angle += 1) + 'deg)';
	},
	checkCollision: function () {
		let collisions = 0
		let tests = 0
		_physics.physicBodies.forEach(element => {
			if (_physics.checkcollisionRect(this.userDiv['player'], element, this.checkcollisionCallback)) collisions++;
			tests++
		});
		return collisions
	},
	setMapPos: function () {
		let x = Math.floor((this.userDiv['mapZone'].clientWidth / 2) - this.user.datas.pos.x)
		let y = Math.floor((this.userDiv['mapZone'].clientHeight / 2) - this.user.datas.pos.y)
		this.userDiv['map'].style.top = y + "px";
		this.userDiv['map'].style.left = x + "px";
	},
	startAnimation: function () {
		this.update = setInterval(
			() => {
				if (_keyboard.actions.ismoving) {
					this.checkPlayerPos()
					let collisions = this.checkCollision()
					this.refreshPlayerPos(0.01, collisions)
					if (collisions < 1) {
						this.setMapPos()
					}
				}
			},
			15
		)
	}
};
export { _game }
