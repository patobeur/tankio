import * as THREE from "three";
import { _core } from './core.js'
const serveurIP = '192.168.1.4';
const serveurPORT = '3500';

window.addEventListener("load", () => {
	doChecksAndStartApp()
});
let doChecksAndStartApp = function () {
	let checks = 0
	if (io) {
		checks = initIfItsOk('io', io, checks)
		const SOCKET = io(`ws://${serveurIP}:${serveurPORT}`);
		if (SOCKET) {
			checks = initIfItsOk('socketIo', SOCKET, checks, SOCKET)
			if (THREE) {
				checks = initIfItsOk('three', THREE, checks, SOCKET)
				Ammo().then(() => {
					checks = initIfItsOk('ammo', Ammo, checks, SOCKET)
				});
			}
		}
	}
}

let initIfItsOk = function (what, fonction, checks, SOCKET = false) {
	checks++
	let answer = what + ' : ' + (fonction ? 'ok ' : 'no ')
	let ele = document.getElementById(what)
	ele.textContent = answer
	console.log(answer)
	if (checks === 4 && SOCKET) {
		startApp(SOCKET)
	}
	return checks
}

let startApp = function (SOCKET) {
	_core.init({ socket: SOCKET })
}

