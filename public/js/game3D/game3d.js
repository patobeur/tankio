// 3d 
import * as THREE from "three";
import { _scene, } from './scene.js'
import { _physics } from './physics.js';
import { _player } from './player.js';
import { _GLTFLoader, _TextureLoader } from './loaders.js';
import { ModelsManager } from './ModelsManager.js';
import { _OrbitControls } from './OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

let _game3d = (user, users, map, newPlayerPositionCallback) => {
	let delta = 0
	let clock = new THREE.Clock()
	let stats = new Stats()
	stats.dom.style.top = 'initial'
	stats.dom.style.bottom = '0'
	let _ModelsManagerClass = undefined
	// ------------------------
	// ANIMATION
	// ------------------------
	const animate = function (time) {
		requestAnimationFrame(animate)
		delta = clock.getDelta()

		if (_ModelsManagerClass.initiated) {
			_ModelsManagerClass.allMeshsAndDatas.character['Kimono_Female'].MegaMixer.update(delta);
		}

		if (_scene.SUN.userData.initiated) _scene.SUN.move();
		if (_player && _player.initiated) _player.update(delta, time); // Vérifier si le joueur bouge
		if (typeof _OrbitControls === 'object') _OrbitControls.update();

		_physics.updateWorldPhysics(delta, time);
		_scene.renderer.render(_scene.scene, _scene.camera);

		stats.update();
	};

	let starter = () => {
		document.body.appendChild(stats.dom);
		_physics._initPhysicsWorld()
		_scene.init(_physics)

		_ModelsManagerClass = new ModelsManager({
			fonctionretour: (allMeshsAndDatas) => {

				_player.init(_physics, _GLTFLoader, _ModelsManagerClass)

				_physics.addRandomPlat(_scene, 5)
				_physics.addRandomBox(_scene, 5)
				_physics.addRandomSphere(_scene, 5)

				_scene.renderer.render(_scene.scene, _scene.camera);
				_OrbitControls.init(_scene, _player)

				animate(0);
			}
		})

	}
	// ------------------------
	// loadAssets
	// ------------------------
	const loadAssets = () => {
		let root = '';
		// _AnimatedLoader.init(root, () => {
		_GLTFLoader.init(root, () => {
			_TextureLoader.init(root, starter)
		})
		// })
	}
	loadAssets()
}


// 3d end

export { _game3d }
