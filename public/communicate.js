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
		this.socket.on("ficheClient", (paquet) => {
			this.maficheClient(paquet)
		})
		// reception d'un message
		this.socket.on("message", (paquet) => {
			this.messageCounter++
			_board.add_srvMessageToChat(paquet, this.messageCounter)
		})

	},

	// LES ACTIONS
	premierContact: function (paquet) {
		// on clean la page html et on la met a jour
		_board.init(paquet)

		let nameButtonCallback = () => {
			if (_board.divs['nameInput'].value != '' && _board.divs['nameInput'].value.length > 5) {
				let paquet = { name: _front.sanitize(_board.divs['nameInput'].value) }
				this.socket.emit('myNameIs', paquet)
			}
		}
		_board.divs['nameInput'].addEventListener('input', (event) => {
			if (event.target.value.length === _board.nameMinChar && _board.nameButtonActive === false) { _board.add_nameButton(nameButtonCallback) }
			if (event.target.value.length < _board.nameMinChar && _board.nameButtonActive === true) { _board.remove_nameButton(nameButtonCallback) }
		})

		this.messageCounter++
		_board.add_srvMessageToChat(paquet, this.messageCounter)
		// this.repondreAuBonjourDuServeur()
	},
	maficheClient: function (datas) {
		let sendMessageCallBack = () => {
			if (_board.divs['inputMessage'].value != '') {
				console.log('fffffffffffffffff')
				let paquet = { message: _front.sanitize(_board.divs['inputMessage'].value) }
				this.socket.emit('message', paquet)
			}
		}
		// this.repondreAuBonjourDuServeur()
		console.log('maficheClient', datas)
		_board.remove_nameButton()
		_board.remove_nameInput()
		_board.add_inputMessage(sendMessageCallBack)
	}
	// Emettre
	// repondreAuBonjourDuServeur: function () {
	// 	let paquet = { message: 'coucou' }
	// 	// dit bonjour au serveur
	// 	_board.add_myMessage(paquet, this.messageCounter)
	// 	this.socket.emit('bonjourFromClient', paquet)
	// }

	//-----EMIT-----------
	// sendEnterRoom: function (room) {
	// 	if (this.nameInput.value != '') {
	// 		this.socket.emit('enterRoom', {
	// 			name: this.nameInput.value,
	// 			couleur: this.colorInput.value,
	// 			room: 'A',
	// 			datas: { modelName: _model.MYMODEL.datas.modelName }
	// 		})
	// 	}
	// 	// this.msgInput.focus()
	// }
}
export { _communicate }
