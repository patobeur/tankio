let _socketing = {
	user: null,
	users: null,
	prevRoom: false,
	socket: false,
	init: function (socket) {
		this.socket = socket
		// à l'initialisation, le serveur envoi un message au client 
		this.ditBonjourAuClient(`[${_Users.getTime()}][Server] ♥ Welcome to this IO test`)
	},
	// quand le serveur parle au client
	sendMessageToPlayer: function (message) {
		this.socket.emit('message', message,)
	},
	ditBonjourAuClient: function (message) {
		this.socket.emit('bonjourClient', message,)
	},
}
export { _socketing }
