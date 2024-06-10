
import { _board } from './board.js'
let _communicate = {
	socket: undefined,
	user: undefined,
	users: {},
	rooms: {},
	activityTimer: false,
	init: function (SOCKET) {

		this.socket = SOCKET

		let newPaquet = {
			name: 'vide'
		}

		this.socketRun();

		this.socket.emit('helloFromClient', newPaquet)
	},
	//-----ON-----------
	socketRun: function () {
		this.socket.on("message", (data) => {
			console.log(`${data}`)
		})
		this.socket.on("helloFromServer", (data) => {
			console.log(`${data}`)
			_board.init()
			_board.buttonConnect.addEventListener('click', () => {
				console.log('ok')
			})
		})

	},
	//-----EMIT-----------
	sendEnterRoom: function (room) {
		if (this.nameInput.value != '') {
			this.socket.emit('enterRoom', {
				name: this.nameInput.value,
				couleur: this.colorInput.value,
				room: 'A',
				datas: { modelName: _model.MYMODEL.datas.modelName }
			})
		}
		// this.msgInput.focus()
	}
}
export { _communicate }
