"use strict";
import express from 'express';
import { Server } from 'socket.io';
import { _socketing } from './server/socketing.js'
import { _Users } from './server/Users.js'
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;

const app = express();


// Middleware CORS pour permettre les requêtes depuis les origines spécifiques
app.use(cors({
	origin: process.env.NODE_ENV === "production" ? false : [
		"http://localhost",
		"http://127.0.0.1",
		"http://192.168.1.4"
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
	console.log(`LOCAL http://127.0.0.1:\x1b[31m${PORT}\x1b[33m/public/index.html\x1b[0m`);
	console.log(`${serveurInfo.name} \x1b[33mLAN:\x1b[32m http://${serveurInfo.iface.address}:${PORT}\x1b[0m`);
	console.log(`\x1b[31mTest:\x1b[34m https://${serveurInfo.iface.address}:${PORT}\x1b[0m`);
	console.log(`________________________________________`);
});

// écouteur sur le serveur pour la connexion du client (méthode avec CORS)
const io = new Server(expressServer, {
	cors: {
		// origin: process.env.NODE_ENV === "production" ? false : [
		// 	"http://localhost",
		// 	"http://127.0.0.1",
		// 	"http://192.168.1.4"
		// ]
		origin: '*', // Vous pouvez restreindre les origines autorisées si nécessaire
		methods: ['GET', 'POST'],
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
	socketing.init(socket)

	console.log(`A User with id ${socket.id} just CONNECTED`)

	// ON DISCONNECT
	socket.on('disconnect', () => {
		console.log(`User with id ${socket.id} just disconnected`);
	});
	// quand le client dit bonjour au serveur
	socket.on('helloFromClient', (datas) => {
		let newPaquet = {
			name: datas.name,
			id: socket.id,
			pos: { x: 0, y: 0, z: 0 },
			other: { x: 1 }
		}
		console.log(`hello from ${socket.id}`);
		console.log(newPaquet);
	});



});

let socketing = {
	user: null,
	users: null,
	prevRoom: false,
	socket: false,
	init: function (socket) {
		this.socket = socket
		// à l'initialisation, le serveur envoi un message au client 
		this.bonjourClient(`[${_Users.getTime()}][Server] ♥ Welcome to this IO test`)
	},
	// 1er message du serveur au cliennt
	bonjourClient: function (message) {
		this.socket.emit('bonjourClient', message,)
	},
	// quand le serveur parle au client
	sendMessageToPlayer: function (message) {
		this.socket.emit('message', message,)
	},
}
