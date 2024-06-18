export const UsersState = {
	users: [],
	setUsers: function (newUsersArray) {
		this.users = newUsersArray
	},
	getTime: function () {
		return new Intl.DateTimeFormat('default', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		}).format(new Date())
	},
	getDateTime: function () {
		var options = {
			// weekday: "long",
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		};
		// options.timeZone = "UTC";
		// options.timeZoneName = "short";
		return new Intl.DateTimeFormat('default', options).format(new Date())
	},
	buildMsg: function (name, text) {
		return {
			name,
			text,
			time: this.getTime()
		}
	},
	activateUserInNewRoom: function (id, name, room, clientdatas, map) {
		let datas = {
			lastTime: this.getTime(),
			clientDatas: {
				color: this.estCouleurHex(clientdatas.color)
			},
			status: {
				falling: false,
				alive: true,
			},
			// mapName: map.name,
			pos: map.spawns[Math.floor(Math.random() * map.spawns.length)],
			size: { w: 16, h: 16, d: 0 },
		}
		let birth = this.getDateTime();
		let fauxid = this.getDateTime();
		const user = { id, fauxid, name, room, birth, datas }
		this.setUsers([
			...this.users.filter(user => user.id !== id),
			user
		])
		return user
	},
	userLeavesApp: function (id) {
		this.setUsers(
			this.users.filter(user => user.id !== id)
		)
	},
	setUserPos: function (id, pos) {
		let user = this.users.find(user => user.id === id)
		if (user) {
			user.datas.pos = pos
		}
	},
	getUser: function (id) {
		return this.users.find(user => user.id === id)
	},
	getUsersInRoom: function (room) {
		return this.users.filter(user => user.room === room)
	},
	getUsers: function (id) {
		return this.users.filter(user => user.id != id)
	},
	getAllActiveRooms: function () {
		return Array.from(new Set(this.users.map(user => user.room)))
	},
	genererCouleurHex: function () {
		let couleur = '#';
		// Générer chaque composante R, G, B en hexadécimal
		for (let i = 0; i < 6; i++) {
			couleur += Math.floor(Math.random() * 16).toString(16); // Génère un chiffre hexadécimal aléatoire (0-15)
		}
		return couleur.toUpperCase();
	},
	estCouleurHex: function (val) {
		if (typeof val !== 'string' || !/^#[0-9A-F]{6}$/i.test(val)) {
			val = this.genererCouleurHex()
		}
		return val;
	}
}
