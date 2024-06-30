let _keyboard = {
	move: { x: 0, y: 0 },
	actions: {},
	keyMap: {},
	tchatActive: false,
	onDocumentKey: function (e, tchatActive) {
		// console.log('onDocumentKey tchatActive', tchatActive)
		if (tchatActive === false) {
			// console.log('keydown')
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
	resetMoves: function () {
		this.setActions()
		this.setKeyMap()
	},
	setActions: function () {
		this.actions = { moveForward: false, moveBackward: false, moveLeft: false, moveRight: false, turnLeft: false, turnRight: false, jump: false, isjumping: false, ismooving: false, rotating: false }
	},
	setKeyMap: function () {
		this.keyMap = { KeyW: false, KeyS: false, KeyA: false, KeyD: false, KeyQ: false, KeyE: false, Space: false, ArrowRight: false, ArrowLeft: false, ArrowUp: false, ArrowDown: false };
	},
	init: function () {
		this.setActions()
		this.setKeyMap()
		document.addEventListener("keydown", (e) => { this.onDocumentKey(e, this.tchatActive) }, true);
		document.addEventListener("keyup", (e) => { this.onDocumentKey(e, this.tchatActive) }, true);
	},
}
let _keyboard3D = {
	_player: undefined,
	actions: {},
	keyMap: {},
	tchatActive: false,
	keyMap: {
		KeyW: false,
		KeyS: false,
		KeyA: false,
		KeyD: false,
		KeyQ: false,
		KeyE: false,
		Space: false,
	},
	setActions: function () {
		this.actions = { moveForward: false, moveBackward: false, moveLeft: false, moveRight: false, turnLeft: false, turnRight: false, jump: false, isjumping: false, ismooving: false, rotating: false }
	},
	setKeyMap: function () {
		this.keyMap = { KeyW: false, KeyS: false, KeyA: false, KeyD: false, KeyQ: false, KeyE: false, Space: false, ArrowRight: false, ArrowLeft: false, ArrowUp: false, ArrowDown: false };
	},
	onDocumentMouseDown: function (event) { if (event.button === 0) _keyboard3D._player.shoot = true; },
	onDocumentMouseUp: function (event) { if (event.button === 0) _keyboard3D._player.shoot = false; },
	onDocumentKey: function (e) {
		if (e.type === "keydown" || e.type === "keyup") _keyboard3D.keyMap[e.code] = e.type === "keydown";
		if (_keyboard3D._player.pointerLocked) {
			_keyboard3D.actions.moveForward = _keyboard3D.keyMap["KeyW"];
			_keyboard3D.actions.moveBackward = _keyboard3D.keyMap["KeyS"];
			_keyboard3D.actions.moveLeft = _keyboard3D.keyMap["KeyQ"];
			_keyboard3D.actions.moveRight = _keyboard3D.keyMap["KeyE"];
			_keyboard3D.actions.turnLeft = _keyboard3D.keyMap["KeyA"];
			_keyboard3D.actions.turnRight = _keyboard3D.keyMap["KeyD"];
			_keyboard3D.actions.jump = _keyboard3D.keyMap["KeyJ"];
			_keyboard3D.actions.switchShoot = _keyboard3D.keyMap["Space"];
			// Condition pour changer le type de tir avec la barre d'espace
			// if (e.code === "Space" && e.type === "keydown") {
			// 	_player.switchShootType();
			// 	// _keyboard3D.actions.jump = true
			// }
		}
	},
	init: function (_player) {
		this._player = _player
		this.setActions()
		this.setKeyMap()
		// console.log('init tchatActive', this.tchatActive)
		// document.addEventListener("keydown", (e) => { this.onDocumentKey(e, this.tchatActive) }, true);
		// document.addEventListener("keyup", (e) => { this.onDocumentKey(e, this.tchatActive) }, true);


	},
}
export { _keyboard3D, _keyboard }
