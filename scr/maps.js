let _maps = {
	maps: {
		'one': {
			name: 'one',
			src: 'map_0.png',
			w: 873, h: 872,
			spawns: [
				{ x: 35, y: -87, z: 0 },
				{ x: -11, y: -87, z: 0 },
				{ x: 250, y: 35, z: 0 },
				{ x: 158, y: -235, z: 0 },
			]
		},
		'two': {
			name: 'two',
			src: 'map_1.png',
			w: 873, h: 872
		},
		'three': {
			name: 'three',
			src: 'map_2.png',
			w: 873, h: 872
		}
	},
	blocsPerMap: {
		'one': {
			invisibleWalls: [
				{ name: '1', x: 0, y: 0, w: 50, h: 50, r: 45, color: { r: 'ff', g: '00', b: '00' } },
				{ name: '2', x: 60, y: 0, w: 50, h: 50, r: 75, color: { r: 'ff', g: '00', b: '00' } },
				{ name: '3', x: 120, y: 0, w: 50, h: 50, r: 85, color: { r: 'ff', g: '00', b: '00' } },
			]
		},
		'two': {
			invisibleWalls: [
				{ name: '1', x: 0, y: 0, w: 50, h: 50, r: 45, color: { r: 'ff', g: '00', b: '00' } },
				{ name: '2', x: 60, y: 0, w: 50, h: 50, r: 75, color: { r: 'ff', g: '00', b: '00' } },
				{ name: '3', x: 120, y: 0, w: 50, h: 50, r: 85, color: { r: 'ff', g: '00', b: '00' } },
			]
		}
	},
	get_mapDatas: function (name) {
		let map = this.maps[name]
		if (this.blocsPerMap[name]) { map.blocs = this.blocsPerMap[name] }
		return map
	}
}

export { _maps }
