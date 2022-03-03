import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import jwt_decode from 'jwt-decode';
import './Settings.css';
import { User } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';
function Settings() {
	let navigate = useNavigate();
	const [user, setUser] = useState<User | null>();
	const [token, setToken] = useState<string | null>();
	useEffect(() => {
		const _token = localStorage.getItem('token');

		setToken(_token);

		if (token === null) {
			navigate('/login');
		} else if (token) {
			const data: User = jwt_decode(token);
			setUser(data);
		}
	}, [token, navigate]);
	return (
		<div className="settings">
			<Navbar />
			<div className="settings_sidebar">
				<p>Profile</p>
			</div>
		</div>
	);
}

export default Settings;
