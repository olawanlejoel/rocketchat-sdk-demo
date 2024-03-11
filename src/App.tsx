import { DDPSDK } from '@rocket.chat/ddp-client';

import { useState, useEffect } from 'react';

const sdk = DDPSDK.create('https://writing-demo.dev.rocket.chat');

async function hashPassword(password: string): Promise<string> {
	// Step 1: Convert the input string to a Uint8Array
	const encoder = new TextEncoder();
	const data = encoder.encode(password);

	// Step 2: Use the SubtleCrypto API to create a hash
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);

	// Step 3: Convert the hash buffer to a hex string
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');

	// Step 4: Return the hashed string
	return hashHex;
}

interface Room {
	_id: string;
	name: string;
}

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [rooms, setRooms] = useState<Room[]>([]);
	const [user, setUser] = useState({
		username: 'funke.test',
		password: 'hola',
	});

	const loginUser = async (username: string, password: string) => {
		await sdk.connection.connect();
		await sdk.account.loginWithPassword(username, await hashPassword(password));
		setLoggedIn(true);

		const userDetails = sdk.account.user;
		console.log(userDetails);

		fetchRooms();
	};

	const fetchRooms = async () => {
		const rooms = await sdk.rest.get('/v1/subscriptions.get');
		setRooms(rooms.update);
	};

	const logoutUser = async () => {
		await sdk.account.logout();
		setLoggedIn(false);
	};

	return (
		<div>
			{loggedIn ? (
				<button onClick={logoutUser}>Logout</button>
			) : (
				<button
					onClick={() => {
						loginUser(user.username, user.password);
					}}
				>
					Login
				</button>
			)}

			<div>
				<h1>Rooms</h1>
				<ul>
					{rooms.map((room: Room) => (
						<li key={room._id}>{room.name}</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default App;
