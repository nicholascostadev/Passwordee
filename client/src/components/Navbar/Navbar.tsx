import './Navbar.css';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { User } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';

function Navbar(): JSX.Element {
	let navigate = useNavigate();
	const login = () => {
		navigate('/login');
	};
	const register = () => {
		navigate('/register');
	};
	const dashboard = () => {
		navigate('/dashboard');
	};
	const settings = () => {
		navigate('/settings');
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		window.location.reload();
	};

	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		const token: string | null = localStorage.getItem('token');
		if (token) {
			const decoded: User = jwt_decode(token);
			setUser(decoded);
		} else {
			setUser(null);
		}
	}, []);

	return (
		<div className="navbar">
			<h1 className="brand">PasWordee</h1>
			<div className="navbar__content">
				{user ? (
					<div>
						<p>{user.email}</p>
						<button onClick={dashboard}>Dashboard</button>
						<button onClick={settings}>Settings</button>
						<button onClick={logout}>Logout</button>
					</div>
				) : (
					<div>
						<button onClick={login}>Login</button>
						<button onClick={register}>Register</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Navbar;
