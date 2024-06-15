import os from 'os';

function _getLocalIpAddress() {
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
function _sanitize(string) {
	const regex = /[^a-zA-Z0-9 ,:'._-]/g;
	return string.replace(regex, '');

	// // TODO
	// const map = {
	// 	"&": "&amp;",
	// 	"<": "&lt;",
	// 	">": "&gt;",
	// 	'"': "&quot;",
	// 	"'": "&#x27;",
	// 	"/": "&#x2F;",
	// 	"`": "&#x60;",
	// 	"=": "&#x3D;",
	// 	"-": "&#x2D;"
	// };
	// const reg = /[&<>"'/`=-]/g;
	// return string.replace(reg, (match) => map[match]);
}
export { _getLocalIpAddress, _sanitize }
