let _maps = {
	startMap: 'three',
	maps: {
		'one': {
			name: 'one',
			src: 'map_0.png',
			w: 873, h: 872,
			spawns: [
				{ x: 300, y: 20, z: 0 },
				{ x: 20, y: 50, z: 0 },
				{ x: 20, y: 100, z: 0 },
			]
		},
		'two': {
			name: 'two',
			src: 'map_1.png',
			w: 911, h: 906,
			spawns: [
				{ x: 35, y: -87, z: 0 },
				{ x: -11, y: -87, z: 0 },
				{ x: 250, y: 35, z: 0 },
			]
		},
		'three': {
			name: 'three',
			src: 'pixel_grid.png',
			w: 500, h: 500,
			spawns: [
				{ x: 40, y: 40, z: 0 },
				{ x: 20, y: 20, z: 0 }
			]
		}
	},
	blocsPerMap: {
		'one': {
			invisibleWalls: [
				{ name: '1', x: 354, y: 77, w: 200, h: 4, r: -35 },
				{ name: '1', x: 647, y: 186, w: 500, h: 4, r: 38 },
				{ name: '1', x: 115, y: 477, w: 300, h: 4, r: 40 },
				{ name: '1', x: 211, y: 340, w: 50, h: 50, r: 0 },
				{ name: '2', x: 453.5, y: 436, w: 60, h: 40, r: 0 },
				{ name: '3', x: 438, y: 732, w: 100, h: 60, r: 40 },
			]
		},
		'two': {
			invisibleWalls: [
				{ name: '1', x: 0, y: 0, w: 50, h: 50, r: 45 },
				{ name: '2', x: 60, y: 0, w: 50, h: 50, r: 75 },
				{ name: '3', x: 120, y: 0, w: 50, h: 50, r: 85 },
			]
		},
		'three': {
			invisibleWalls: [
				{ name: '1', x: 250, y: -2, w: 500, h: 4, r: 0 },
				{ name: '1', x: 250, y: 502, w: 500, h: 4, r: 0 },
				{ name: '2', x: -2, y: 250, w: 4, h: 500, r: 0 },
				{ name: '3', x: 502, y: 250, w: 4, h: 500, r: 0 },
			]
		},
	},
	get_mapDatas: function (name = false) {
		let map = name ? this.maps[name] : this.maps[this.startMap]
		console.log('map', map)
		if (this.blocsPerMap[map.name]) { map.blocs = this.blocsPerMap[map.name] }
		return map
	}
}

export { _maps }
