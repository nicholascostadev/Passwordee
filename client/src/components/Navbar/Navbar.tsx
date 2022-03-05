import './Navbar.css';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { User } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar(): JSX.Element {
	const [showMenu, setShowMenu] = useState<boolean>(false);

	let navigate = useNavigate();
	const login = () => {
		navigate('/login');
	};
	const register = () => {
		navigate('/register');
	};
	const dashboard = () => {
		setShowMenu(false);
		navigate('/dashboard');
	};
	const settings = () => {
		setShowMenu(false);
		navigate('/settings');
	};

	const logout = () => {
		localStorage.removeItem('token');
		setShowMenu(false);
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

	const mobileSidebar = document.querySelector('.mobileSidebar');

	useEffect(() => {
		if (showMenu) {
			mobileSidebar?.classList.remove('hide');
			mobileSidebar?.classList.remove('hidden');
		} else {
			mobileSidebar?.classList.add('hide');
			setTimeout(() => {
				mobileSidebar?.classList.add('hidden');
			}, 500);
		}
	}, [showMenu, mobileSidebar?.classList]);

	return (
		<div className="navbar">
			<h1
				className="brand"
				onClick={() => {
					setShowMenu(false);
					navigate('/');
				}}
			>
				PasWordee
			</h1>
			<div className="navbar__content">
				{user ? (
					<div>
						<p>{user.email}</p>
						<button onClick={dashboard}>Dashboard</button>
						<button onClick={settings}>Settings</button>
						<button onClick={logout}>Logout</button>
						<button
							className="hamburger"
							onClick={() => setShowMenu(!showMenu)}
						>
							<MenuIcon sx={{ fontSize: 'xlarge' }} />
						</button>
						<div className="mobileSidebar hide hidden">
							<p>{user.email}</p>
							<button onClick={dashboard}>Dashboard</button>
							<button onClick={settings}>Settings</button>
							<button onClick={logout}>Logout</button>
						</div>
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
