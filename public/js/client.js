"use strict";

import { _board, _console, _genererCouleurHex } from './funcs/board.js'
import { _front, } from './funcs/front.js'
import { _resize2d, } from './funcs/resize2d.js'
import { _keyboard, } from './funcs/keyboard.js'
import { _game } from './game/game.js'
import { _game3d } from './game3D/game3d.js'

let _client = {
	socket: undefined,
	user: undefined,
	users: {},
	rooms: {},
	activityTimer: false,
	openRooms: [],
	messageCounter: new Number(0),
	//-----------------------------------------
	init: function (paquet) {
		console.log('_client : ok')
		this.socket = paquet.socket
		this.socketRun();
		this.sendRequestInit();
	},
	//-----------------------------------------
	socketRun: function () {
		// send init
		this.socket.on("init", (paquet) => {
			console.log('Acces Granted !')
			this.openRooms = paquet.openRooms
			// on clean la page html et on la met a jour
			_board.init()

			this.newPlayerPositionCallback = (datas) => {
				this.socket.emit('newPlayerPosition', datas)
			}
			this.enterRoomButtonCallback = (room) => {
				this.sendEnterRoom(room)
			}
			this.onKeyEnterMessageCallback = (e) => {
				if (_game.tchatActive) {
					if (e.code === "Enter" && e.type === "keydown") {
						this.sendMessageToRoomButtonCallback()
					}
				}
			}
			this.sendMessageToRoomButtonCallback = () => {
				// TODO
				let sanitizedmessage = _front.sanitize(_board.divs['inputMessage'].value)

				if (sanitizedmessage && sanitizedmessage != '') {
					let paquet = {
						name: this.user.name,
						message: sanitizedmessage,
						room: this.user.room
					}
					this.socket.emit('sendPlayerMessageToRoom', paquet)
				}
				_board.divs['inputMessage'].value = ''
			}
			this.onBlurMessageToRoomButtonCallback = (event) => {
				// _game.tchatActive = false;
				_keyboard.tchatActive = false;
				console.log('out tchat')
			}
			this.onFocusSendMessageToRoomButtonCallback = (event) => {
				console.log('enter tchat')
				// _game.tchatActive = true;
				_keyboard.tchatActive = true;
				_keyboard.resetMoves()
			}
			this.nameInputCallback = (event) => {
				if (event.target.value.length >= 0) {
					event.target.value = _front.sanitizeName(event.target.value)
					let val = (100 / _board.nameMinChar) * event.target.value.length
					val = val > 100 ? 100 : val;
					_board.divs['nameNeededItem'].style.width = val + '%'
				}
				if (event.target.value.length > _board.nameMaxChar) {
					let trop = event.target.value.length - _board.nameMaxChar
					trop = trop > _board.nameMinChar ? _board.nameMinChar : trop
					let val = 100 - ((100 / _board.nameMinChar) * trop)
					val = val < 0 ? 0 : val;
					_board.divs['nameNeededItem'].style.width = val + '%'
				}
				if (event.target.value.length > _board.nameMaxChar + _board.nameMinChar) {
					event.target.value = event.target.value.substring(0, event.target.value.length - 1)
				}
				if ((event.target.value.length >= _board.nameMinChar || event.target.value.length <= _board.nameMaxChar) && _board.roomsActive === false) {
					_board.nameStyleIfCorect(true)
					_board.add_Rooms(this.openRooms, this.enterRoomButtonCallback)
				}

				if ((event.target.value.length < _board.nameMinChar || event.target.value.length > _board.nameMaxChar) && _board.roomsActive === true) {
					_board.nameStyleIfCorect(false)
					_board.remove_Rooms()
				}
			}
			_board.divs['nameInput'].addEventListener('input', this.nameInputCallback)
			_board.divs['nameInput'].focus()
		})
		// Listen for roomFull
		this.socket.on('roomFull', (paquet) => {
			this.openRooms = paquet.openRooms
			console.log('room full sorry')
			_board.remove_Rooms()
			_board.add_Rooms(this.openRooms, this.enterRoomButtonCallback)

		})
		// Listen for welcome
		this.socket.on('welcome', (paquet) => {
			console.log('welcome in room :' + paquet.user.room)
			_board.remove_nameInput(this.nameInputCallback)
			_board.add_Rooms(this.openRooms, this.enterRoomButtonCallback, paquet.user.room)
			_board.divs['clientContainer'].remove()

			_board.add_chatArea()
			_board.divs['inputMessage'].addEventListener('blur', this.onBlurMessageToRoomButtonCallback, true)
			_board.divs['inputMessage'].addEventListener('focus', this.onFocusSendMessageToRoomButtonCallback, true)
			// _board.divs['inputMessage'].focus()
			_board.divs['sendMessageToRoomButton'].addEventListener('click', this.sendMessageToRoomButtonCallback, true)

			document.addEventListener("keydown", this.onKeyEnterMessageCallback, true);

			this.user = paquet.user
			this.users = paquet.users
			this.map = paquet.map


			_board.add_roomers({ user: this.user, users: this.users })



			// initialization
			_game.init(this.user, this.users, this.map, this.newPlayerPositionCallback)
			_game3d(this.user, this.users, this.map, this.newPlayerPositionCallback)

			_resize2d.init(_game)
		})

		// Listen for message send
		this.socket.on("message", (data) => _console.addMultipleMessages(data))

		// // Listen refreshActiveRoomsList
		// this.socket.on("refreshActiveRoomsList", (data) => {
		// 	console.log('nothing happen refreshActiveRoomsList', data)
		// })
		// // Listen refreshActiveRoomsList
		// this.socket.on("refreshSoloPlayerPos", (user) => {
		// 	console.log('refreshPlayerPos', user.datas.pos)
		// })
		// Listen refreshActiveRoomsList
		this.socket.on("refreshGamePositions", (paquet) => {
			_game.refresh_roomers({ users: paquet.users })
		})

		// en test avant intégration
		this.socket.on("refreshUsersListInRoom", (paquet) => {
			if (paquet.users.length > 1) {
				_board.refresh_roomers({ user: this.user, users: paquet.users })
				_game.refresh_roomers({ users: paquet.users })
			}
		})
		// en test avant intégration
		this.socket.on("disconnected", (message) => {
			location.reload();
		})
	},
	//-----SEND------------
	sendRequestInit: function () {
		console.log('Requesting Acces !')
		this.socket.emit('requestAccess', 1)
	},
	sendEnterRoom: function (room) {
		if (_board.divs['nameInput'].value != '' && _board.divs['nameInput'].value.length >= 5) {
			// TODO
			let sanitazedvalue = _front.sanitizeName(_board.divs['nameInput'].value)
			this.socket.emit('enterRoom', {
				name: sanitazedvalue,
				room: room,
				datas: {
					color: _genererCouleurHex()
				}
			})
		}
	}
}
export { _client }
