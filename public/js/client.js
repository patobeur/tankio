"use strict";
import { _board, _console, _names, _front } from './board.js'
import { _game } from './game.js'
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

			this.enterRoomButtonCallback = (room) => {
				this.sendEnterRoom(room)
			}
			// le BOUTON SEND MESSAGE TO ROOM
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
				_game.tchatActive = false;
			}
			this.onFocusSendMessageToRoomButtonCallback = (event) => {
				_game.tchatActive = true;
			}
			this.nameInputCallback = (event) => {
				if (event.target.value.length === _board.nameMinChar && _board.roomsActive === false) {
					_board.nameStyleIfCorect(true)
					_board.add_Rooms(this.openRooms, this.enterRoomButtonCallback)
				}
				if (event.target.value.length < _board.nameMinChar && _board.roomsActive === true) {
					_board.nameStyleIfCorect(false)
					_board.remove_Rooms()
				}
				if (event.target.value.length > 0) {
					event.target.value = _front.sanitizeName(event.target.value)
				}
			}
			// quand le nom fait 5 ou plus 
			_board.divs['nameInput'].addEventListener('input', this.nameInputCallback)

			_board.divs['nameInput'].focus()
		})
		// Listen for welcome
		this.socket.on('welcome', (paquet) => {
			console.log('welcome recu du serveur')
			console.log('on entre dans la room ' + paquet.user.room)

			_board.remove_nameInput(this.nameInputCallback)
			_board.add_Rooms(this.openRooms, this.enterRoomButtonCallback, paquet.user.room)
			_board.divs['clientContainer'].remove()

			_board.add_Folders(paquet, this.messageCounter)

			_board.add_chatArea()
			_board.divs['inputMessage'].addEventListener('blur', this.onBlurMessageToRoomButtonCallback, false)
			_board.divs['inputMessage'].addEventListener('focus', this.onFocusSendMessageToRoomButtonCallback, true)
			// _board.divs['inputMessage'].focus()
			_board.divs['sendMessageToRoomButton'].addEventListener('click', this.sendMessageToRoomButtonCallback, true)


			this.usersOld = {}
			this.user = paquet.user
			this.users = paquet.users

			// initialization
			// _game.init(this.user, this.users)
		})

		// Listen for message send
		this.socket.on("message", (data) => _console.addMultipleMessages(data))

		// en test avant intégration
		this.socket.on("refreshUsersListInRoom", (paquet) => {
			console.log('commande refreshUsersListInRoom recu ')
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
			})
			_board.divs['nameInput'].value = ''
		}
	}
}
export { _client }
