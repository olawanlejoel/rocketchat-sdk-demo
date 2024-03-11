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

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false);
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
	};

	const logoutUser = async () => {
		await sdk.account.logout();
		setLoggedIn(false);
	};

	// useEffect(() => {

	// 	login();
	// }, [user]);

	return (
		<div>
			<h1>Hello World!</h1>

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
		</div>
	);
};

export default App;
