// Exemple de gestion de l'état des utilisateurs
export class _Users {
	static users = [];
	static getTime() { return new Date().toLocaleTimeString(); }
	// retourne les datas de l'utilisateur avec l'id indiqué
	static getUser(id) { return this.users.find(user => user.id === id); }
	// retourne les utilisateurs dans la room indiquée
	static getUsersInRoom(room) {
		return this.users.filter(user => user.room === room);
	}
	static activateUserInNewRoom(id, room) {
		let user = this.getUser(id);
		user.room = room
		return user;
	}
	// static activateUserInNewRoom(id, name, color, room, datas) {
	// 	const user = { id, name, color, room, datas };
	// 	this.users.push(user);
	// 	return user;
	// }

	static activateUser(id) {
		let name = 'invité'
		let room = ''
		let birth = this.getTime()
		let datas = {
			pos: { x: 0, y: 0, z: 0 }
		}
		let color = 'FFFFFF'

		const user = { id, name, color, room, birth, datas };

		this.users.push(user);
		return user;
	}

	static userLeavesApp(id) {
		// filtre tout les id sauf l'id à enlever
		this.users = this.users.filter(user => user.id !== id);
	}

	static setUserPos(id, pos) {
		const user = this.getUser(id);
		if (user) {
			user.datas.pos = pos;
		}
	}

	static getAllActiveRooms() {
		return [...new Set(this.users.map(user => user.room))];
	}
}
