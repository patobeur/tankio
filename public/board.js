import { _front } from './front.js'
const _board = {
	nameButtonActive: false,
	nameMinChar: 5,
	divs: {},
	init: function () {
		this.divs['joinDiv'] = document.getElementById('joincontainer')
		this.divs['joinDiv'].textContent = '';
		this.divs['chat'] = _front.createDiv({ tag: 'div', attributes: { className: 'chat-area', textContent: '' }, style: {} })
		this.divs['clientContainer'] = _front.createDiv({ tag: 'div', attributes: { className: 'client-container', }, style: {} })
		this.divs['inputMessage'] = _front.createDiv({ tag: 'textarea', attributes: { placeholder: 'message', className: 'message-area', textContent: '' }, style: {} })
		this.divs['nameInput'] = _front.createDiv({ tag: 'input', attributes: { type: 'texte', placeholder: 'enter your name...', className: 'name-area', textContent: '' }, style: {} })
		this.divs['nameButton'] = _front.createDiv({ tag: 'button', attributes: { className: 'name-button', textContent: 'validate' } })
		this.divs['sendButton'] = _front.createDiv({ tag: 'button', attributes: { className: 'name-button', textContent: 'send' } })

		this.divs['joinDiv'].appendChild(this.divs['clientContainer']);
		this.divs['joinDiv'].appendChild(this.divs['chat']);

		this.divs['clientContainer'].appendChild(this.divs['nameInput']);
	},
	get_nameInputValue: function () {
		_front.sanitize(this.divs['nameInput'].value)
	},
	//---------------------------------------
	add_nameButton: function (nameButtonCallback) {
		console.log('add_nameButton')
		this.divs['clientContainer'].appendChild(this.divs['nameButton']);
		this.divs['nameButton'].addEventListener('click', nameButtonCallback, true)
		this.nameButtonActive = true
	},
	add_inputMessage: function (nameButtonCallback) {
		console.log('add_inputMessage')
		this.divs['clientContainer'].appendChild(this.divs['inputMessage']);
		this.divs['clientContainer'].appendChild(this.divs['sendButton']);
		this.divs['sendButton'].addEventListener('click', nameButtonCallback, true)
	},
	remove_nameButton: function (nameButtonCallback) {
		console.log('remove_nameButton')
		this.divs['nameButton'].removeEventListener('click', nameButtonCallback, true)
		this.divs['nameButton'].remove()
		this.nameButtonActive = false
	},
	remove_nameInput: function () {
		console.log('remove_nameInput')
		this.divs['nameInput'].remove()
		this.nameButtonActive = false
	},
	//---------------------------------------
	add_srvMessageToChat: function (paquet, messageCounter) {
		let cleanMessage = _front.sanitize(paquet.message)
		let newMessageDiv = _front.createDiv({ tag: 'div', attributes: { className: 'message serveur', textContent: cleanMessage }, style: {} })
		this.divs['chat'].appendChild(newMessageDiv);
		console.log(`${messageCounter} ${cleanMessage}`)
	}
}
export { _board }
