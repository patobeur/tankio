import { _Users } from './Users.js'
let _socketing = {
	user: null,
	users: null,
	prevRoom: 'générale',
	socket: false,
	init: function (socket) {
		this.socket = socket
		this.user = _Users.activateUser(socket.id)
		// à l'initialisation, le serveur envoi un message au client 
		this.ditBonjourAuClient(`[${_Users.getTime()}][Server] Welcome to this IO test`)
		if (_Users.users.length < 2) {
			this.envoiMessageAuClient(`[${_Users.getTime()}][Server] You are the first ♥ !!`)
		} else {
			this.envoiMessageAuClient(`[${_Users.getTime()}][Server] You are the ${_Users.users.length}th ♥ !!`)
		}
	},
	// quand le serveur parle au nouvel arrivant
	ditBonjourAuClient: function (message) {
		console.log('ditBonjourAuClient', _Users.getUser(this.socket.id))

		let paquet = {
			fiche: {
				// id: this.user.id,
				name: this.user.name,
				room: this.user.room,
				prevRoom: this.user.prevRoom,
				color: this.user.color,
				birth: this.user.birth,
			},
			datas: this.user.datas,
			message: message
		}
		this.socket.emit('bonjourClient', paquet,)
	},
	envoiMessageAuClient: function (message) {
		let paquet = {
			message: message
		}
		this.socket.emit('message', paquet,)
	},
}
export { _socketing }
