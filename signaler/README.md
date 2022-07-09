# Communicator
A simple library to establish a peer to peer connection between two (or more) peers and exchange data between them. Built on top of `SimplePeer` and `WebSocket`.

The reason for this library's creation was for use in a 3D real-time video chat application called [SpaceBar](https://github.com/IrisHub/SpaceBar). So to keep with the theme, this library was named Communicator, inspired by the [device used in Star Trek](https://en.wikipedia.org/wiki/Communicator_%28Star_Trek%29) to allow for real time peer-to-peer audio communication (a phone, basically).

![Star Trek Communicator](https://d.ibtimes.co.uk/en/full/1447661/captain-kirk-using-communicator-startrek.jpg)

## Core Features
* Abstracts away the [signaling server](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling), which is a necessary component in establishing a WebRTC connection between two devices, to create a simple API for the client with a single `send` function to pass data to peers.
* Creates "rooms" that (currently) up to two peers can join by simply passing an ID. For example, the `pathname` of a URL (`/my-room-name`). Only peers who join the same room will be able to establish a connection.
* Ability to route data over multiple channels, either via a P2P connection (PEER => OTHER PEER) or via the signaling server (PEER => SERVER => OTHER PEER), allowing for increased robustness through redundancy and message multihoming.

## How to Use
There are two parts to getting started. The first is the signaling server, and the second is the Communicator client. Start by getting the signaling server running.

### Signaling Server
Currently, the signaling server must be run as an HTTP server locally. You may do this by navigating to the directory called `signaler` and starting the node server. For an extra bit of convenience, two scripts have been created for you, so you can simply run:
```
npm run watch
```

This will start your node server. This script uses [nodemon](https://www.npmjs.com/package/nodemon) to watch for changes in your source code it can automatically restart your node application. 

You can alternatively run:
```
npm run watch debug
```
This will start your node server in debug mode, which means you will get all the logs from the debug log level and below. 

> Pro Tip: For running custom log levels, you can start your node server with the environment variable `LOG_LEVEL=xxxxx nodemon app.ts`

### Communicator
Once you have the signaling server up and running, integrating the `Communicator` class into your application should be relatively straightforward. You first have to initialize the class by providing a roomID, which can be any string:
```
const communicator = new Communicator("test_room_1");
```

You may also optionally enable debug mode by setting the second argument to `true`.
```
const communicator = new Communicator("test_room_1", true);
```
Finally, you can subscribe to any of the following listeners:
```
communicator.on('connect', (data) => { });
communicator.on('message', (message) => { });
communicator.on('disconnect', (data) => { });
communicator.on('error', (error) => { });
```
This is what each of them do:
* `connect` -- Fires when the client is finally connected to a peer over WebRTC.
* `message` -- Fires any time a message is received from another peer, either over WebRTC or via the server.
* `disconnect` -- Fires when the peer disconnects.
* `error` -- Fires when something goes wrong, e.g. sending data before the peer connection is established.

Sending data to a peer is also quite simple. Just call:
```
communicator.send(stringifiedData, CommunicatorChannel.PEER);
```
Two few things to note. 
1. You must serialize your data into a string before sending, and deserialize it back into an object after receiving. This keeps things simple as there is no confusion about who manages format of the data. 
2. If you intend on sending via `CommunicatorChannel.PEER`, you may omit the second argument entirely as it defaults to sending over the P2P connection. If you'd like to send it over the server, you can use `communicator.send(stringifiedData, CommunicatorChannel.SERVER);` instead.

Sending messages to the other peer will only work IF YOU ARE CURRENTLY CONNECTED. There are two convenience getters provided to help you check: `peerConnected` and `serverConnected`. Use `peerConnected` if you intend to send via `CommunicatorChannel.PEER` and use `serverConnected` if you intend to send via `CommunicatorChannel.SERVER`.

### Example
Below is a simple example client (peer) using the `Communicator` API to send messages back and forth to the other peer.
```
import { useRef, useEffect } from  'react'
import { useLocation } from  'react-router-dom';
import  Communicator, { CommunicatorChannel } from  './network/communicator'

function  Peer() {
	const  location = useLocation();
	const  communicator = useRef<Communicator>();

	useEffect(() => {
		communicator.current = new  Communicator(location.pathname);

		communicator.current.on('connect', (data) => {
			console.log("Peers are connected.");
		});

		communicator.current.on('message', (message) => {
			console.log('message', message);
		});

		communicator.current.on('disconnect', (data) => {
			console.log('disconnect');
		});

		communicator.current.on('error', (error) => {
			console.log('error');
		});
	}, [location.pathname]);

	function  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const  data = (event.currentTarget.elements[0] as HTMLInputElement).value;
		if (communicator.current && communicator.current.peerConnected) {
			communicator.current.send(data.toString(), CommunicatorChannel.SERVER);
		}
	}

	return (
		<form  onSubmit={(e)=>handleSubmit(e)}>
			<textarea  id="incoming"></textarea>
			<button  type="submit">submit</button>
		</form>
	);
}

export  default  Peer;
```

## Future Work
* Easy API for video & audio streaming once the WebRTC connection has been established.
* Ability to connect more than two peers together in a room in an efficient manner.
* Deploying the Signaling Server to a service like Heroku to host on the internet instead of locally.