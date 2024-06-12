import { _front } from './front.js'
import { _board } from './board.js'
let _communicate = {
	socket: undefined,
	user: undefined,
	users: {},
	rooms: {},
	activityTimer: false,
	messageCounter: new Number(0),
	init: function (SOCKET) {
		this.socket = SOCKET
		this.ecouterLesMessagesDuServeur();
	},
	//-----ON-----------
	ecouterLesMessagesDuServeur: function () {
		// reception du 1er message du serveur
		this.socket.on("bonjourClient", (paquet) => {
			this.premierContact(paquet)
		})
		// reception du welcome pour entre dans la room générale
		this.socket.on("welcomeToSalon", (paquet) => {

			this.user = paquet.user
			this.users = paquet.users

			_board.add_myFolder(paquet, this.messageCounter)

			this.messageCounter++
			_board.add_srvMessageToChat(paquet, this.messageCounter)

			this.displayinputMessage(paquet)
		})
	},

	// LES ACTIONS
	premierContact: function (paquet) {
		console.log('premierContact du serveur')
		// on clean la page html et on la met a jour
		_board.init(paquet)
		console.log('paquet recus du serveur', paquet)

		// on prepare les champs pour le name
		this.nameButtonCallback = () => {
			if (_board.divs['nameInput'].value != '' && _board.divs['nameInput'].value.length > 5) {
				let paquet = { id: this.socket.id, name: _front.sanitize(_board.divs['nameInput'].value) }
				console.log('my socket.id', this.socket.id)
				// console.log('my user.id', this.user.id)
				this.socket.emit('myNameIs', paquet)
			}
		}
		_board.divs['nameInput'].addEventListener('input', (event) => {
			if (event.target.value.length === _board.nameMinChar && _board.nameButtonActive === false) {
				_board.add_nameButton(this.nameButtonCallback)
			}
			if (event.target.value.length < _board.nameMinChar && _board.nameButtonActive === true) {
				_board.remove_nameButton(this.nameButtonCallback)
			}
		})

		this.messageCounter++
		_board.add_srvMessageToChat(paquet, this.messageCounter)
	},
	displayinputMessage: function (datas) {
		this.sendMessageCallBack = () => {
			if (_board.divs['inputMessage'].value != '') {
				let paquet = { message: _front.sanitize(_board.divs['inputMessage'].value) }
				this.socket.emit('messageToRoom', paquet)
			}
		}
		_board.remove_nameButton(this.nameButtonCallback)
		_board.remove_nameInput(this.nameButtonCallback)
		_board.add_inputMessage(this.sendMessageCallBack)
		_board.divs['inputMessage'].focus()
	},
	refreshRoomsList: function (rooms) {
		this.rooms = rooms
		console.log('rooms', this.rooms)
		// this.roomList.textContent = ''
		// if (this.rooms) {
		// 	this.rooms.forEach((room, i) => {
		// 		let classPlus = ''
		// 		if (room === this.user.room) {
		// 			classPlus = ' moi'
		// 		}
		// 		let roomDiv = _front.createDiv({ tag: 'span', attributes: { className: 'room-span' + classPlus, textContent: room } })
		// 		this.roomList.appendChild(roomDiv)
		// 	})
		// 	let icoDiv = _front.createDiv({ tag: 'span', attributes: { className: 'ico-span', textContent: 'R' } })
		// 	this.roomList.appendChild(icoDiv)
		// }
	},
	// Emettre
	// exemple de fonction
	// repondreAuBonjourDuServeur: function () {
	// 	let paquet = { message: 'coucou' }
	// 	// dit bonjour au serveur
	// 	_board.add_myMessage(paquet, this.messageCounter)
	// 	this.socket.emit('bonjourFromClient', paquet)
	// }

	//-----EMIT-----------
}
export { _communicate }
