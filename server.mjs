"use strict";
import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import { _getLocalIpAddress, _sanitize } from './scr/serverTools.js';
import { UsersState } from './scr/usersState.js'
import { _maps } from './scr/maps.js'

import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const PORTClient = 5500;

const app = express();

// Middleware CORS pour permettre les requêtes depuis des origines spécifiques
app.use(cors({
	origin: process.env.NODE_ENV === "production" ? false : [
		// "http://localhost",
		// "http://127.0.0.1",
		"http://192.168.1.4"
	],
	methods: ["GET", "POST"]
}));


// Servir les fichiers statiques de public, de server et de node_modules
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules_min', express.static(path.join(__dirname, 'node_modules_min')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// c'est partis pour le serveur sur le bon PORT et l'ip local detectée
const expressServer = app.listen(PORT, () => {
	const serveurInfo = _getLocalIpAddress();
	console.log(`________________________________________`);
	console.log(`listening on port \x1b[31m${PORT}\x1b[0m`);
	// console.log(`LOCAL http://127.0.0.1:\x1b[31m${PORTClient}\x1b[33m/public/index.html\x1b[0m`);
	console.log(`${serveurInfo.name} \x1b[33mLAN:\x1b[32m http://${serveurInfo.iface.address}:${PORT}\x1b[0m`);
	console.log(`________________________________________`);
});

// écouteur sur le serveur pour la connexion du client (méthode avec CORS)
const io = new Server(expressServer, {
	cors: {
		// origin: process.env.NODE_ENV === "production" ? false : [
		// 	"http://localhost",
		// 	"http://127.0.0.1",
		// 	"http://192.168.1.7"
		// ]
		origin: '*', // Vous pouvez restreindre les origines autorisées si nécessaire
		// methods: ['GET', 'POST'],
		methods: ['POST'],
		allowedHeaders: ['Content-Type'],
		credentials: true
	}
});
let _rooms = {
	maxrooms: 3,
	maxUserPerRooms: 3,
	roomsName: ['a', 'b', 'c'],
	openRooms: [],
	setOpensRooms: function () {
		this.openRooms = []
		for (let roomIndex = 0; (roomIndex < this.maxrooms && roomIndex < this.roomsName.length); roomIndex++) {
			const element = this.roomsName[roomIndex];
			let usersInRoom = UsersState.getUsersInRoom(element)
			if (usersInRoom.length < this.maxUserPerRooms) { this.openRooms.push(element) }

		}
	},
	getOpensRooms: function () {
		this.setOpensRooms()
		return this.openRooms
	},
	init: function () {
		this.setOpensRooms()
	},

}
let _socketing = {
	user: null,
	users: null,
	prevRoom: false,
	socket: false,
	init: function (socket) {
		this.socket = socket
	},
	sendInitToPlayer: function () {
		let paquet = {
			id: this.socket.id,
			openRooms: _rooms.getOpensRooms(),//['a', 'b', 'c'], // TODO generate it
			folders: ['name', 'room'],
			user: {
				name: 'invité',
				room: 'vide'
			}
		}
		this.socket.emit('init', paquet)

	},
	sendMessageToPlayer: function (message) {
		this.socket.emit('message', message,)
	},
	leaveRoom: function ({ id, name }) {
		if (this.prevRoom) {
			this.socket.leave(this.prevRoom)
			// LE JOUEUR A QUITTÉ LA ROOM

			// message to all user in prevroom
			io.to(this.prevRoom).emit('message',
				`[${UsersState.getTime()}][${this.prevRoom}][Server] ${name} has left the room`
			)

			this.updatePrevRoomUserList()
		}
	},
	updatePrevRoomUserList: function () {
		// send new userList for all users in prevroom
		io.to(this.prevRoom).emit('updateUserList', {
			users: UsersState.getUsersInRoom(this.prevRoom)
		})
	},
	sendPlayerMessageToRoom: function (paquet) {
		const user = UsersState.getUser(paquet.socketId)
		if (user && paquet && paquet.name && paquet.room && paquet.message) {
			// TODO
			let sanmessage = _sanitize(paquet.message)
			const room = user.room
			const name = user.name
			if (name === paquet.name && room === paquet.room) {
				io.to(room).emit('message', `[${UsersState.getTime()}][${room}][${name}] ${sanmessage}`)
			}
		}

	}
}
// quand on se connect au serveur
io.on('connection', (socket) => {
	_socketing.init(socket)
	console.log(`User ${socket.id} CONNECTED`)
	console.log(UsersState.users.length + ' on wire !')

	socket.on('requestAccess', (value) => {
		if (value === 1) {
			_socketing.sendInitToPlayer()
		}
	})
	socket.on('newPlayerPosition', (datas) => {
		UsersState.setUserPos(socket.id, datas.datas.pos)
		if (_socketing.user && typeof _socketing.user.room != 'undefined') {
			_socketing.users = UsersState.getUsersInRoom(_socketing.user.room)
			io.to(_socketing.user.room).emit('refreshGamePositions', {
				users: _socketing.users,
			})
		}
		else {
			console.log('joueur sans room', socket.id)
			socket.emit('disconnected', 'serveur reboot')
		}
	})
	socket.on('enterRoom', ({ name, room, clientdatas = {} }) => {
		let usersInRoomCount = UsersState.getUsersInRoom(room).length
		if (usersInRoomCount < _rooms.maxUserPerRooms) {

			// MAP 
			let map = _maps.get_mapDatas('one')

			// met la room du user dans prevRoom (vide si vide) si le user existe
			_socketing.prevRoom = UsersState.getUser(socket.id)?.room

			// leave previous room if prevRoom
			if (_socketing.prevRoom) _socketing.leaveRoom({ id: socket.id, name: socket.name })

			// defini le joueur en le mettant dans une room
			_socketing.user = UsersState.activateUserInNewRoom(socket.id, name, room, clientdatas, map)
			_socketing.users = UsersState.getUsersInRoom(_socketing.user.room)

			// on join la room 
			socket.join(_socketing.user.room)

			// send Welcome Paquet message (je parle dans socket donc au client )
			socket.emit('welcome', {
				user: _socketing.user,
				users: _socketing.users,
				message: `[${UsersState.getTime()}][${_socketing.user.room}][Server] You have joined the ${_socketing.user.room} chat room`,
				map: map
			})

			// To everyone else in the room (je parle dans io donc a tous mais que dans la room du user socket)
			io.to(_socketing.user.room).emit(
				'message', `[${UsersState.getTime()}][${_socketing.user.room}][${_socketing.user.name}] has joined the room`
			)

			// idem // Update user list for room 
			io.to(_socketing.user.room).emit('refreshUsersListInRoom', {
				user: _socketing.user,
				users: _socketing.users,
				message: `[${UsersState.getTime()}][${_socketing.user.room}][Server] ${_socketing.user.name} has joined the room`
			})

			// idem // Update rooms list for everyone 
			io.emit('refreshActiveRoomsList', {
				rooms: UsersState.getAllActiveRooms()
			})
			// Update rooms list for everyone in the room
			io.to(_socketing.user.room).emit('addPlayer', {
				rooms: UsersState.getAllActiveRooms()
			})
			console.log(UsersState.users.length + ' on wire !')
		}
		else {
			io.emit('roomFull', {
				openRooms: _rooms.getOpensRooms()
			})
		}




	})

	// newuserposition
	socket.on('newuserposition', (data) => {
		const pos = data.pos;
		const other = data.other;
		// const name = data.name;
		// no check
		// no verif
		// nothing
		UsersState.setUserPos(socket.id, pos);
		const usersCount = UsersState.getUsersInRoom(_socketing.user.room).length

		if (usersCount > 1) {
			io.to(_socketing.user.room).emit('updPlayerById', {
				id: socket.id,
				pos: pos,
				other: other
			})
		}
	})

	// When user disconnects - to all others 
	socket.on('disconnect', () => {
		const user = UsersState.getUser(socket.id)
		if (_socketing.prevRoom) _socketing.leaveRoom({ id: socket.id, name: socket.name })
		UsersState.userLeavesApp(socket.id)


		if (user) {
			io.to(user.room).emit('message', `[${UsersState.getTime()}][${user.room}][${user.name}]  has left the room`)

			io.to(user.room).emit('refreshUsersListInRoom', {
				users: UsersState.getUsersInRoom(user.room),
				message: 'test'
			})

			io.emit('refreshRoomsList', {
				rooms: UsersState.getAllActiveRooms()
			})
		}

		console.log(`User ${socket.id} disconnected`)
	})

	// Listening for a message event 
	socket.on('sendPlayerMessageToRoom', (paquet) => {
		paquet.socketId = socket.id
		_socketing.sendPlayerMessageToRoom(paquet)
	})

	// // Listen for activity 
	// socket.on('activity', (name) => {
	// 	const room = UsersState.getUser(socket.id)?.room

	// 	console.log('activity', UsersState.getUser(socket.id))
	// 	if (room) {
	// 		const paquet = {
	// 			name: name,
	// 			user: UsersState.getUser(socket.id)
	// 		}
	// 		socket.broadcast.to(room).emit('activity', paquet)
	// 	}
	// })
})
