// Exemple de gestion de l'état des utilisateurs
export class _Users {
	static users = [];

	static getTime() {
		return new Date().toLocaleTimeString();
	}

	static getUser(id) {
		return this.users.find(user => user.id === id);
	}

	static getUsersInRoom(room) {
		return this.users.filter(user => user.room === room);
	}

	static activateUserInNewRoom(id, name, color, room, datas) {
		const user = { id, name, color, room, datas };
		this.users.push(user);
		return user;
	}

	static userLeavesApp(id) {
		this.users = this.users.filter(user => user.id !== id);
	}

	static setUserPos(id, pos) {
		const user = this.getUser(id);
		if (user) {
			user.pos = pos;
		}
	}

	static getAllActiveRooms() {
		return [...new Set(this.users.map(user => user.room))];
	}
}
