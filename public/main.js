import * as THREE from "three";
import { _communicate } from './communicate.js'
const serveurIP = '192.168.1.4';
const serveurPORT = '3500';

window.addEventListener("load", () => {
	doChecksAndStartApp()
});
let doChecksAndStartApp = function () {
	let checks = 0
	if (io) {
		checks = itsOk('io', io, checks)
		const SOCKET = io(`ws://${serveurIP}:${serveurPORT}`);
		if (SOCKET) {
			checks = itsOk('socketIo', SOCKET, checks, SOCKET)
			if (THREE) {
				checks = itsOk('three', THREE, checks, SOCKET)
				Ammo().then(() => {
					checks = itsOk('ammo', Ammo, checks, SOCKET)
				});
			}
		}
	}
}
let itsOk = function (what, fonction, checks, SOCKET = false) {
	checks++
	let answer = what + ' : ' + (fonction ? 'ok ' : 'no ')
	let ele = document.getElementById(what)
	ele.textContent = answer
	console.log(answer)
	if (checks === 4 && SOCKET) {
		// STARTER
		startApp(SOCKET) // exemple
	}
	return checks
}

let startApp = function (SOCKET) {
	console.log('_communicate.init(SOCKET)')
	_communicate.init(SOCKET)
}

