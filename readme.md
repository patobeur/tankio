# socket io 

Socket io simple app

![Demo Tankio gif animé](/tankio_demo.gif "Demo Tankio gif").

## start server

    npm install
    npm start or npm run dev (for nodemon)

    open index.html with "Live Server" for client

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
	<script src="/node_modules/three/examples/jsm/libs/ammo.wasm.js"></script>
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


### CLIENT SIDE -> add your local server ip to *public/main.js* 
    
    const SOCKET = io(`ws://192.168.1.2:3500`);

### AmmoJs's npm not working properly so *public/index.html*

i use *node_modules_ammo*/three/examples/jsm/libs/ammo.wasm.js

