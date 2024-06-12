import { _front } from './front.js'
const _board = {
	nameButtonActive: false,
	nameMinChar: 5,
	divs: {},
	init: function () {
		this.divs['myFolder'] = _front.createDiv({ tag: 'div', attributes: { className: 'myfolder', textContent: 'myname' }, style: {} })
		this.divs['myName'] = _front.createDiv({ tag: 'div', attributes: { className: 'myname', textContent: 'myname' }, style: {} })
		this.divs['logo'] = _front.createDiv({ tag: 'img', attributes: { src: 'tankioChat.png', className: 'chat-logo', }, style: {} })
		this.divs['joinDiv'] = document.getElementById('joincontainer')
		this.divs['chat'] = _front.createDiv({ tag: 'div', attributes: { className: 'chat-area', textContent: '' }, style: {} })
		this.divs['clientContainer'] = _front.createDiv({ tag: 'div', attributes: { className: 'client-container', }, style: {} })
		this.divs['inputMessage'] = _front.createDiv({ tag: 'textarea', attributes: { placeholder: 'message', className: 'message-area', textContent: '' }, style: {} })
		this.divs['sendButton'] = _front.createDiv({ tag: 'button', attributes: { className: 'send-button', textContent: 'send' } })

		this.divs['nameInput'] = _front.createDiv({ tag: 'input', attributes: { type: 'texte', placeholder: 'enter your name...', className: 'name-input bad', textContent: '' }, style: {} })
		this.divs['nameButton'] = _front.createDiv({ tag: 'button', attributes: { className: 'name-button', textContent: '✔️' } })


		this.divs['joinDiv'].textContent = '';
		this.divs['joinDiv'].appendChild(this.divs['clientContainer']);
		this.divs['joinDiv'].appendChild(this.divs['chat']);
		this.divs['joinDiv'].prepend(this.divs['logo']);

		this.divs['clientContainer'].appendChild(this.divs['nameInput']);

	},
	add_myFolder: function (paquet) {
		let user = paquet.user
		this.divs['myFolder'] = _front.createDiv({ tag: 'div', attributes: { className: 'myfolder', textContent: '' }, style: {} })
		this.divs['myName'] = _front.createDiv({ tag: 'div', attributes: { className: 'folder-item myname', textContent: user.name }, style: {} })
		this.divs['myRoom'] = _front.createDiv({ tag: 'div', attributes: { className: 'folder-item myroom', textContent: user.room }, style: {} })
		this.divs['jokker'] = _front.createDiv({ tag: 'div', attributes: { className: 'folder-item jokker', textContent: 'jokker' }, style: {} })

		this.divs['myFolder'].appendChild(this.divs['myName']);
		this.divs['myFolder'].appendChild(this.divs['myRoom']);
		this.divs['myFolder'].appendChild(this.divs['jokker']);
		this.divs['joinDiv'].prepend(this.divs['myFolder']);

	},
	get_nameInputValue: function () {
		_front.sanitize(this.divs['nameInput'].value)
	},
	//---------------------------------------
	add_nameButton: function (nameButtonCallback) {
		this.divs['clientContainer'].appendChild(this.divs['nameButton']);
		this.divs['nameButton'].addEventListener('click', nameButtonCallback, true)
		this.divs['nameInput'].classList.remove('bad')
		this.nameButtonActive = true
	},
	add_inputMessage: function (nameButtonCallback) {
		this.divs['clientContainer'].appendChild(this.divs['inputMessage']);
		this.divs['clientContainer'].appendChild(this.divs['sendButton']);
		this.divs['sendButton'].addEventListener('click', nameButtonCallback, true)
	},
	remove_nameButton: function (nameButtonCallback) {
		this.divs['nameButton'].removeEventListener('click', nameButtonCallback, true)
		this.divs['nameButton'].remove()
		this.divs['nameInput'].classList.add('bad')
		this.nameButtonActive = false
	},
	remove_nameInput: function () {
		this.divs['nameInput'].remove()
		this.nameButtonActive = false
	},
	//---------------------------------------
	add_srvMessageToChat: function (paquet, messageCounter) {
		let cleanMessage = messageCounter + '_' + _front.sanitize(paquet.message)
		let newMessageDiv = _front.createDiv({ tag: 'div', attributes: { className: 'message serveur', textContent: cleanMessage }, style: {} })
		this.divs['chat'].appendChild(newMessageDiv);
		// console.log(`${messageCounter} ${cleanMessage}`)
	}
}
export { _board }
