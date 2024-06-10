import * as THREE from "three";
import { _communicate } from './communicate.js'

const serverIP = '192.168.1.4'
const serverPORT = '3500'

window.addEventListener("load", () => {
	const SOCKET = io(`ws://${serverIP}:${serverPORT}`);
	Ammo().then(() => { startApp(SOCKET) });
});

let startApp = function (SOCKET) {
	_communicate.init(SOCKET)
}

