import { _Users } from './Users.js'
import { _front } from '../public/front.js';
let _socketing = {
	user: null,
	roomUsers: null,
	prevRoom: null,
	io: false,
	socket: false,
	init: function (socket, io) {
		this.socket = socket
		this.io = io
		this.user = _Users.activateUser(this.socket.id)
		console.log('new id ??', this.socket.id)
		// à l'initialisation, le serveur envoi un message au client 

		this.ditBonjourAuClient()
		// let paquet = _Users.users.length < 2
		// 	? `[${_Users.getTime()}][Server] You are the first ♥ !!`
		// 	: `[${_Users.getTime()}][Server] You are the ${_Users.users.length}th ♥ !!`;
		// this.envoiMessagePriveeAuClient(paquet)


		// quand le client répond au bonjour envoyé du serveur envoyé 
		socket.on('bonjourFromClient', (datas) => {
			let paquet = _Users.getUser(socket.id)
			console.log(`hello from ${paquet.id}`);
			console.log(`hello from ${datas.message}`);
		});
		// quand le client répond au bonjour du serveur il entre dans salon
		socket.on('myNameIs', (datas) => {
			let user = _Users.getUser(socket.id)
			// TODO validation of name 
			let name = _front.sanitize(datas.name)
			// update name in user
			user.name = name
			// valider chez le client
			this.enterRoom(user.id, 'SALON')
		});
		// ON DISCONNECT
		socket.on('disconnect', () => {
			let oldId = socket.id
			_Users.userLeavesApp(oldId)
			console.log(`User with id ${oldId} just disconnected`);
			console.log(_Users.users.length + ' on wire !')

		});

	},
	enterRoom: function (id, room) {
		// { name, couleur, room, datas }
		console.log(this.socket.id + ' enter in room : ' + room)
		console.log(id + ' enter in room : ' + room)
		if (id != this.socket.id) {
			console.log('############## id ' + id + '  ################')
			console.log('####### socket.id' + this.socket.id + ' ######')
		}
		// this.prevRoom = _Users.getUser(socket.id)?.room

		// join room 
		this.socket.join(room)

		// leave previous room if prevRoom
		if (this.prevRoom) {
			// console.log('############## leaveRoom ################')
			// console.log(this.prevRoom, id)
			this.leaveRoom({ id: id, name: socket.name })
		}

		this.user = _Users.activateUserInNewRoom(id, room)
		this.roomUsers = _Users.getUsersInRoom(this.user.room)

		// console.log('#########################################')
		// console.log(this.user.name)
		// console.log('############## enter ################')
		// console.log(this.user.room)
		// console.log('#########################################')

		let paquet = {
			user: this.user,
			users: this.roomUsers,
			message: `[${_Users.getTime()}][${this.user.room}][Server] You have joined the ${this.user.room} chat room`
		}
		// send Welcome Paquet message
		this.socket.emit('welcomeToSalon', paquet)

		// // To everyone else in the room
		// io.to(this.user.room).emit(
		// 	'message',  `[${_Users.getTime()}][${this.user.room}][${this.user.name}] has joined the room`
		// )

		// // Update user list for room 
		// this.io.to(this.user.room).emit('refreshUsersListInRoom', {
		// 	users: this.roomUsers,
		// 	message: `[${_Users.getTime()}][${this.user.room}][Server] ${this.user.name} has joined the room`
		// })

		// // Update rooms list for everyone 
		// this.io.emit('refreshRoomsList', {
		// 	rooms: _Users.getAllActiveRooms()
		// })
		// // Update rooms list for everyone in the room
		// this.io.to(this.user.room).emit('addPlayer', {
		// 	rooms: _Users.getAllActiveRooms()
		// })
	},
	// quand le serveur parle au nouvel arrivant
	ditBonjourAuClient: function () {
		console.log('ditBonjourAuClient', _Users.getUser(this.socket.id))
		let paquet = {
			// fiche: {
			// 	// id: this.user.id,
			// 	name: this.user.name,
			// 	room: this.user.room,
			// 	color: this.user.color,
			// 	birth: this.user.birth,
			// },
			// datas: this.user.datas,
			message: `[${_Users.getTime()}][Server] Welcome, your ID is : ${this.socket.id}, what your name ?`
		}
		this.socket.emit('bonjourClient', paquet,)
	},
	leaveRoom: function ({ id, name }) {
		if (this.prevRoom) {

			this.socket.leave(this.prevRoom)
			// LE JOUEUR A QUITTÉ LA ROOM

			// message to all user in prevroom
			this.io.to(this.prevRoom).emit(
				'message',
				`[${_Users.getTime()}][${this.prevRoom}][Server] ${name} has left the room`
			)

			this.updatePrevRoomUserList()
		}
	},
	updatePrevRoomUserList: function () {
		// send new userList for all users in prevroom
		this.io.to(this.prevRoom).emit('updateUserList', {
			users: _Users.getUsersInRoom(this.prevRoom)
		})
	}

}
export { _socketing }
