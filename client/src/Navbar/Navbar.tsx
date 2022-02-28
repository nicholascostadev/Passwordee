import './Navbar.css';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';

interface User {
	id: string;
	email: string;
	iat: number;
}

function Navbar(): JSX.Element {
	const [user, setUser] = useState<User | null>();
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (typeof token === 'string') {
			const decoded: User = jwt_decode(token);
			setUser(decoded);
		} else {
			setUser(null);
		}
	}, [user]);

	return (
		<div className="navbar">
			<h1 className="brand">PasWordee</h1>
			<p>Menu</p>
			{user ? (
				<div>
					<p>{user.email}</p>{' '}
					<button
						onClick={() => {
							localStorage.removeItem('token');
						}}
					>
						Logout
					</button>
				</div>
			) : null}
		</div>
	);
}

export default Navbar;
