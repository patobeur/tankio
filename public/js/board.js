"use strict";
const _front = {
	id: new Number(0),
	createDiv: function (params) {
		let element = document.createElement(params.tag);
		if (params.attributes) {
			for (const key in params.attributes) {
				if (Object.hasOwnProperty.call(params.attributes, key))
					element[key] = params.attributes[key];
				if (params.style) {
					for (const key2 in params.style) {
						if (Object.hasOwnProperty.call(params.style, key2))
							element.style[key2] = params.style[key2];
					}
				}
			}
		}
		return element;
	},
	addCss(stringcss, styleid) {
		let style = document.createElement("style");
		style.textContent = stringcss;
		style.id = "css_" + styleid;
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	replace: function (string) {
		// TODO
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
	},
	sanitize: function (string) {
		// TODO
		const regex = /[^a-zA-Z0-9 ,:'._-]/g;
		return string.replace(regex, '*');
	},
	rand: (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min); },
};
const _board = {
	roomsActive: false,
	roomButtonsActive: false,
	nameMinChar: 5,
	divs: {},
	init: function () {

		this.divs['joinDiv'] = document.getElementById('tankio')
		this.divs['joinDiv'].textContent = '';

		this.divs['chat'] = _front.createDiv({ tag: 'div', attributes: { className: 'chat-area' }, style: {} })
		this.divs['logo'] = _front.createDiv({ tag: 'img', attributes: { src: 'assets/tankioChat.png', className: 'chat-logo', }, style: {} })
		this.divs['clientContainer'] = _front.createDiv({ tag: 'div', attributes: { className: 'client-container', }, style: {} })
		this.divs['senderContainer'] = _front.createDiv({ tag: 'div', attributes: { className: 'send-container' }, style: {} })

		this.divs['joinDiv'].appendChild(this.divs['logo']);
		this.divs['joinDiv'].appendChild(this.divs['clientContainer']);
		this.divs['joinDiv'].appendChild(this.divs['chat']);
		this.divs['joinDiv'].appendChild(this.divs['senderContainer']);

		this.divs['nameInput'] = _front.createDiv({ tag: 'input', attributes: { type: 'texte', placeholder: 'enter your name...', className: 'name-input bad', textContent: '' }, style: {} })

		this.divs['inputMessage'] = _front.createDiv({ tag: 'textarea', attributes: { placeholder: 'message', className: 'message-area', textContent: '' }, style: {} })
		this.divs['sendMessageToRoomButton'] = _front.createDiv({ tag: 'button', attributes: { className: 'send-button', textContent: 'send' } })

		this.divs['clientContainer'].appendChild(this.divs['nameInput']);
	},
	add_Folders: function (paquet) {
		this.divs['folders'] = _front.createDiv({ tag: 'div', attributes: { className: 'folders', textContent: '' }, style: {} })
		let user = paquet.user
		let folders = ['name', 'room']
		folders.forEach(element => {
			let folderName = 'folder' + element
			this.divs[folderName] = _front.createDiv({ tag: 'div', attributes: { className: 'folder-item', textContent: user[element] }, style: {} })
			this.divs['folders'].appendChild(this.divs[folderName]);
		});
		this.divs['joinDiv'].prepend(this.divs['folders']);
	},

	add_Rooms: function (rooms, enterRoomButtonCallback) {
		this.divs['rooms'] = _front.createDiv({ tag: 'div', attributes: { className: 'rooms', textContent: '' }, style: {} })
		this.divs['roomtitle'] = _front.createDiv({ tag: 'div', attributes: { className: 'room-item', textContent: 'Choose a room' }, style: {} })
		rooms.forEach(element => {
			let roomName = 'room' + element
			this.divs[roomName] = _front.createDiv({ tag: 'div', attributes: { className: 'room-item', textContent: element }, style: {} })
			this.divs[roomName].addEventListener('click', (event) => { enterRoomButtonCallback(element) })
			this.divs['rooms'].appendChild(this.divs[roomName]);
		});
		this.divs['rooms'].prepend(this.divs['roomtitle']);
		this.divs['clientContainer'].appendChild(this.divs['rooms']);
		_board.roomsActive = true
	},
	remove_Rooms: function () {
		if (this.divs['rooms']) this.divs['rooms'].remove()
		_board.roomsActive = false
	},

	remove_nameInput: function (nameInputCallback) {
		this.divs['nameInput'].removeEventListener('click', nameInputCallback, true)
		this.divs['nameInput'].remove()
	},
	add_inputMessage: function (sendMessageToRoomButtonCallback) {
		this.divs['senderContainer'].appendChild(this.divs['inputMessage']);
		this.divs['senderContainer'].appendChild(this.divs['sendMessageToRoomButton']);
		this.divs['sendMessageToRoomButton'].addEventListener('click', sendMessageToRoomButtonCallback, true)
	},

	nameStyleIfCorect: function (iscorect = false) {
		iscorect === true
			? this.divs['nameInput'].classList.remove('bad')
			: this.divs['nameInput'].classList.add('bad');
	},
}
const _console = {
	counter: new Number(0),
	messages: {},
	id: new Number(0),
	addMultipleMessages: function (message) {
		if (arguments.length > 0) {
			let a = arguments
			if (a.length > 1) {
				let fullmess = ''
				for (const key in a) {
					if (Object.hasOwnProperty.call(a, key)) {
						const element = a[key];
						let mess = ''
						if (typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean') {
							mess = element + ''
						}
						else if (element.message && (typeof element.message === 'string' || typeof element.message === 'number' || typeof element.message === 'boolean')) {
							mess = element.message + ''
						}
						if (mess != '') {
							let virgule = (fullmess != '') ? ', ' : ''
							fullmess = fullmess + virgule + mess
						}
					}
				}
				if (fullmess != '') {
					// TODO 
					// fullmess = _front.sanitize(fullmess)
					console.log('---------------------------fullmess1', fullmess)
					this.addUniqueMessage(fullmess)
				}
			}
			else if (a.length === 1) {
				let mess = ''
				if (typeof a[0] === 'string' || typeof a[0] === 'number' || typeof a[0] === 'boolean') {
					mess = a[0]
				}
				else if (a[0].message) {
					if (typeof a[0].message === 'string' || typeof a[0] === 'number' || typeof a[0] === 'boolean') {
						mess = a[0].message
					}
				}
				if (mess != '') {
					// TODO 
					// mess = _front.sanitize(mess)
					console.log('---------------------------fullmess2', mess)
					this.addUniqueMessage(mess)
				}
			}
		}
	},
	addUniqueMessage: function (message) {
		let newMess = _front.createDiv({
			tag: 'div', attributes: {
				id: 'message_' + this.id,
				className: 'message',
			}
		});
		let newSpan = _front.createDiv({
			tag: 'span', attributes: {
				textContent: '[' + (this.counter < 10 ? '0' : '') + this.counter + '] ' + message
			}
		});
		newSpan.classList.add('new')
		setTimeout(() => {
			newSpan.classList.remove('new')
		}, 1000);
		newMess.appendChild(newSpan)
		this.messages[this.id] = newMess;
		this.id++;
		this.counter++;
		_board.divs['chat'].appendChild(newMess)
		// this.scrollerDiv.scroll(0, 10000)
		_board.divs['chat'].scroll(0, _board.divs['chat'].scrollHeight)
	},
}
const _names = {
	name: null,
	lettreParFrequences: [
		['E', 14.71], ['A', 9.24], ['I', 8.66], ['O', 7.11],
		['U', 7.10],//5.73
		['N', 6.63], ['R', 6.37], ['T', 6.13], ['S', 5.99],
		// ['U', 5.73],//5.73
		['L', 5.45], ['D', 3.47], ['M', 3.11], ['C', 3.11], ['P', 2.89], ['V', 1.42],
		['G', 1.21], ['B', 0.96], ['F', 0.95], ['H', 0.92], ['J', 0.68], ['Q', 0.65],
		['K', 0.05], ['W', 0.04], ['X', 0.03], ['Y', 0.03], ['Z', 0.01],
	],
	donneUneLettre: function () {
		// Choisir la lettre en fonction de sa fréquence 
		const frequenceTotal = this.lettreParFrequences.reduce((sum, [lettre, frequence]) => sum + frequence, 0)
		const randomValue = Math.random() * frequenceTotal
		let cumulativefrequence = 0
		for (const [lettre, frequence] of this.lettreParFrequences) {
			cumulativefrequence += frequence
			if (randomValue <= cumulativefrequence) {
				return lettre
			}
		}
		return '_' // en cas d'erreur '_' 
	},
	getAName: function () {
		const nameLength = Math.floor(Math.random() * 4) + 5 // Longueur aléatoire entre 5 et 8 caractères
		let firstName = ''
		for (let i = 0; i < nameLength; i++) {
			firstName += this.donneUneLettre()
		}
		return firstName
	}
};
export { _board, _console, _names, _front }