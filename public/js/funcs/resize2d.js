
import { _front } from './front.js'
import { _board } from './board.js'
let _resize2d = {
	cur: new Number(0),
	sizes: ['middle', 'full', 'small'],
	class: 'middle',
	element: undefined,
	resize: function () {
		this.cur++
		if (this.cur >= this.sizes.length) this.cur = 0;
	},
	init: function (game) {
		this.element = _front.createDiv({
			tag: 'div',
			attributes: { className: 'resize-map', textContent: `🖥️` },
			style: { cursor: 'pointer', position: 'absolute', top: '10px', right: '50px', zIndex: '1000' }
		})
		this.element.addEventListener('click', () => {
			this.resize()
			game.userDiv['playersZone'].classList = "players-zone " + this.sizes[this.cur]
			game.setMapPos()
		})

		document.body.appendChild(this.element)
	}
}
export { _resize2d }
