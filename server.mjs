"use strict";
// import * as THREE from "three";
import express from 'express';
import { Server } from 'socket.io';
import { _Users } from './server/Users.js'

import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import cors from 'cors';

import { _socketing } from './server/socketing.js'
import { _front } from './public/front.js';

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
		// "http://192.168.1.7"
	],
	methods: ["GET", "POST"]
}));


// Servir les fichiers statiques de public, de server et de node_modules
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'server')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// c'est partis pour le serveur sur le bon PORT et l'ip local detectée
const expressServer = app.listen(PORT, () => {
	const serveurInfo = getLocalIpAddress();
	console.log(`________________________________________`);
	console.log(`listening on port \x1b[31m${PORT}\x1b[0m`);
	console.log(`LOCAL http://127.0.0.1:\x1b[31m${PORTClient}\x1b[33m/public/index.html\x1b[0m`);
	console.log(`${serveurInfo.name} \x1b[33mLAN:\x1b[32m http://${serveurInfo.iface.address}:${PORTClient}/public/index.html\x1b[0m`);
	// console.log(`\x1b[31mTest:\x1b[34m https://${serveurInfo.iface.address}:${PORTClient}\x1b[0m`);
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
// pour choper l'ip en local
function getLocalIpAddress() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				continue;
			}
			return { name: name, iface: iface };
		}
	}
	return '0.0.0.0';
}

// échanges quand on se connect au serveur
io.on('connection', (socket) => {
	console.log(`A User with id ${socket.id} just CONNECTED`)
	_socketing.init(socket)
	console.log(_Users.users.length + ' on wire !')

	socket.on('message', (datas) => {
		let user = _Users.getUser(socket.id)
		let preMessage = `[${_Users.getTime()}][${user.room}][${user.name}]`
		let postmessage = _front.sanitize(datas.message)
		let paquet = { message: preMessage + postmessage }
		socket.emit('message', paquet)
		// TODO broadcasting
		console.log('room', user.room)
		// io.to(user.room).emit('message', paquet)
		// socket.broadcast.to(user.room).emit('message', paquet)
	});
	// quand le client répond au bonjour du serveur envoyé dans _socketing.init
	socket.on('bonjourFromClient', (datas) => {
		let paquet = _Users.getUser(socket.id)
		console.log(`hello from ${paquet.id}`);
		console.log(`hello from ${datas.message}`);
	});
	// quand le client répond au bonjour du serveur
	socket.on('myNameIs', (datas) => {
		let user = _Users.getUser(socket.id)
		// TODO validation of name 
		let name = _front.sanitize(datas.name)
		// update name in user
		user.name = name
		// valider chez le client
		socket.emit('ficheClient', { datas: user })
	});
	// ON DISCONNECT
	socket.on('disconnect', () => {
		let oldId = socket.id
		_Users.userLeavesApp(oldId)
		console.log(`User with id ${oldId} just disconnected`);
		console.log(_Users.users.length + ' on wire !')
	});
});
