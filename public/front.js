let _front = {
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
	sanitize: function (string) {
		const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "./": "&#x2F;" };
		const reg = /[&<>"'/]/gi;
		return string.replace(reg, (match) => map[match]);
	},
	rand: (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min); },
};
export { _front }
