import { _physics } from '../js/game/physics.js'
import { _front } from '../js/game/board.js'

var allDivs = {};

var cont = _front.createDiv({ tag: 'div', attributes: { className: 'map', textContent: '' }, style: { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'white' } })
var msgDiv = _front.createDiv({ tag: 'div', attributes: { className: 'msg', textContent: 'ok' }, })

allDivs['PLAYER'] = new _physics.Rectangle(_front.createDiv({ tag: 'div', attributes: { id: 'player', className: 'player', textContent: '' }, style: { position: 'absolute', borderRadius: '50%', backgroundColor: '#FF0000', width: '32px', height: '32px', transform: 'rotate(28.9deg)', top: '140px', left: '250px' } }), false);
allDivs['wall_1'] = new _physics.Rectangle(_front.createDiv({ tag: 'div', attributes: { className: 'wall', textContent: 'W1' }, style: { position: 'absolute', backgroundColor: '#00FF00', width: '250px', height: '75px', transform: 'rotate(16deg)', top: '60px', left: '180px' } }));
allDivs['wall_2'] = new _physics.Rectangle(_front.createDiv({ tag: 'div', attributes: { className: 'wall', textContent: 'W2' }, style: { position: 'absolute', backgroundColor: '#0000FF', width: '60px', height: '275px', transform: 'rotate(16deg)', top: '160px', left: '280px' } }));

document.body.appendChild(cont)
document.body.appendChild(msgDiv)
cont.appendChild(allDivs['wall_1'].htmlElement)
cont.appendChild(allDivs['wall_2'].htmlElement)
cont.appendChild(allDivs['PLAYER'].htmlElement)

window.requestAnimFrame = function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame;
}();

let checkcollisionCallback = (element) => {
	element.htmlElement.style.transform = 'rotate(' + (element.angle += 5.5) + 'deg)';
}
function draw() {
	let collisions = 0
	allDivs['PLAYER'].htmlElement.style.transform = 'rotate(' + (allDivs['PLAYER'].angle += 1.2) + 'deg)';

	_physics.physicBodies.forEach(element => {
		if (_physics.checkcollisionRect(allDivs['PLAYER'], element, checkcollisionCallback)) collisions++
	});

	if (collisions > 0) {
		msgDiv.textContent = collisions + ' collision' + (collisions > 1 ? 's' : '') + ' detected!';
	}
	else {
		if (msgDiv.textContent != '') { msgDiv.textContent = '' }
	}

	setTimeout(function () {
		window.requestAnimFrame(draw);
	}, 50);
}
window.requestAnimFrame(draw);
