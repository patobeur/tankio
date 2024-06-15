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
	const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "./": "&#x2F;" };
	const reg = /[&<>"'/]/gi;
	return string.replace(reg, (match) => map[match]);
}
export { _getLocalIpAddress, _sanitize }
