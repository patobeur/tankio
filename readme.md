# socket io 

Socket io simple local lan app

## start server

    npm install
    npm start or npm run dev (for nodemon)

    open index.html with "Live Server" for client
	
	or open client in your browser http://192.168.xxx.xxx:3500 with your ip

## bugs

- [ ] tell me

### packages

```json
	{
		"name": "tankio",
		"version": "1.0.0",
		"description": "",
		"main": "server.mjs",
		"type": "module",
		"scripts": {
			"dev": "nodemon server.mjs",
			"start": "node server.mjs"
		},
		"author": "",
		"license": "ISC",
		"dependencies": {
			"ammo.js": "^0.0.10",
			"express": "^4.17.1",
			"socket.io": "^4.1.3",
			"three": "^0.132.2"
		},
		"devDependencies": {
			"nodemon": "^3.1.3"
		}
	}
``` 

### ip connection set ( server side )

server.mjs

```javascript

	const io = new Server(expressServer, {
		cors: {
			origin: '*', // Pour restreindre les origines 
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type'],
			credentials: true
		}
	});
```

- [ ] server need to be standAlone as client


### CLIENT SIDE -> Front imports 

```html
	<script src="/node_modules_min/three/examples/jsm/libs/ammo.wasm.js"></script>
	<script src="/node_modules/socket.io/client-dist/socket.io.js"></script>
	<script type="importmap">
	{
		"imports": {
		"three": "/node_modules/three/build/three.module.js",
		"three/addons/": "/node_modules/three/examples/jsm/"
		}
	}
	</script>
	<script defer type="module" src="main.js"></script>
```

- [ ] client need to be standAlone as server


### CLIENT SIDE -> add your local server ip to *public/js/main.js* 
    
    import * as THREE from "three";
	import { _client } from './client.js'
	const serveurIP = 'xxx.xxx.xxx.xxx';
	const serveurPORT = '3500';



![Demo Tankio gif animé](/docs/tankio_demo2.gif "Demo Tankio gif").
