import { _board, _console, _names, _front } from './board.js'
let _core = {
	socket: undefined,
	user: undefined,
	users: {},
	rooms: {},
	activityTimer: false,
	openRooms: [],

	messageCounter: new Number(0),
	init: function (datas) {
		this.socket = datas.socket
		this.socketRun();
	},
	//-----ON-----------
	socketRun: function () {
		// send init
		this.socket.on("init", (paquet) => {
			this.openRooms = paquet.openRooms
			// on clean la page html et on la met a jour
			_board.init()
			this.enterRoomButtonCallback = (room) => {
				this.sendEnterRoom(room)
			}
			// le BOUTON SEND MESSAGE TO ROOM
			this.sendMessageToRoomButtonCallback = () => {
				let message = _front.sanitize(_board.divs['inputMessage'].value)
				_board.divs['inputMessage'].value = ''
				if (message && message != '') {
					console.log('SEND MESSAGE TO ROOM', message)
					let paquet = {
						name: this.user.name,
						message: message,
						room: this.user.room
					}
					this.socket.emit('sendPlayerMessageToRoom', paquet)
				}
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
			}
			// quand le nom fait 5 ou plus 
			_board.divs['nameInput'].addEventListener('input', this.nameInputCallback)
		})
		// Listen for welcome
		this.socket.on('welcome', (paquet) => {
			console.log('welcome recu du serveur')
			console.log('paquet recu', paquet)
			console.log('on entre dans la room ' + paquet.user.room)
			_board.remove_Rooms()
			_board.remove_nameInput(this.nameInputCallback)
			_board.add_Folders(paquet, this.messageCounter)
			_board.divs['clientContainer'].remove()


			_board.add_inputMessage(this.sendMessageToRoomButtonCallback)
			_board.divs['inputMessage'].focus()



			this.usersOld = {}
			this.user = paquet.user
			this.users = paquet.users
			let log = paquet.message

			// initialization
			// this.GAME.initPlayer(this.user)
		})

		// Listen for message send
		this.socket.on("message", (data) => _console.log(data))

		// en test avant intégration
		this.socket.on("refreshUsersListInRoom", (paquet) => {
			console.log('commande refreshUsersListInRoom recu ', paquet
			)
		})
	},
	//---------------------
	//-----SEND------------
	sendEnterRoom: function (room) {
		if (_board.divs['nameInput'].value != '' && _board.divs['nameInput'].value.length >= 5) {
			this.socket.emit('enterRoom', {
				name: _front.sanitize(_board.divs['nameInput'].value),
				room: room,
			})
			_board.divs['nameInput'].value = ''
		}
	}
}
export { _core }
