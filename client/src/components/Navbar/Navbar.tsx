import './Navbar.css';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { User } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';

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
		navigate('/login');
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
	const closeIcon = document.querySelector('.closeIcon');
	const menuIcon = document.querySelector('.menuIcon');

	useEffect(() => {
		// Logic for making the sidebar on mobile closed when first entered.
		// and this logic repeats whenever the user clicks on the hamburger menu.
		if (showMenu) {
			mobileSidebar?.classList.remove('hide');
			mobileSidebar?.classList.remove('hidden');
			menuIcon?.classList.add('hidden');
			closeIcon?.classList.remove('hidden');
		} else {
			mobileSidebar?.classList.add('hide');
			closeIcon?.classList.add('hidden');
			menuIcon?.classList.remove('hidden');
			setTimeout(() => {
				mobileSidebar?.classList.add('hidden');
			}, 500);
		}
	}, [
		showMenu,
		mobileSidebar?.classList,
		closeIcon?.classList,
		menuIcon?.classList,
	]);

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
						{/* Prioritize username if user has */}
						<p>{user.username || user.email}</p>
						<button onClick={dashboard}>Dashboard</button>
						<button onClick={settings}>Settings</button>
						<button onClick={logout}>Logout</button>
						<button
							className="hamburger"
							onClick={() => setShowMenu(!showMenu)}
						>
							<MenuIcon className="menuIcon" sx={{ fontSize: 'xlarge' }} />
							<ClearIcon className="closeIcon" />
						</button>
						<div className="mobileSidebar hide hidden">
							<p>{user.username || user.email}</p>
							<button onClick={dashboard}>Dashboard</button>
							<button onClick={settings}>Settings</button>
							<button onClick={logout}>Logout</button>
						</div>
					</div>
				) : (
					<div className="notLoggedIn">
						<button onClick={login}>Login</button>
						<button onClick={register}>Register</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Navbar;
