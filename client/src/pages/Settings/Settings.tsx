import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import jwt_decode from 'jwt-decode';
import './Settings.css';
import { User } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
function Settings() {
	let navigate = useNavigate();

	// Authentication
	const [user, setUser] = useState<User | null>();
	const [token, setToken] = useState<string | null>();
	
	// 'current' is going to be set to the page on the 'settings' the user is trying to access
	// e.g:
	// user access 'profile' settings, so the 'current' state will be set to 'profile'
	// and the 'profile' component will be rendered.
	// It's may not be forever like that, maybe I'll change it later on.
	const [current, setCurrent] = useState<string | null>('profile');

	// New user's settings on 'profile' settings page.
	const [newUsername, setNewUsername] = useState<string>('');
	const [fullName, setFullName] = useState<string>('');

	useEffect(() => {
		const _token = localStorage.getItem('token');
		setToken(_token);

		// Same auth logic, if token is null, user has to login again
		if (token === null) {

			// If user doesn't have a valid token, redirect to login page
			navigate('/login');
		} else if (token) {
			const data: User = jwt_decode(token);
			setUser(data);
		}
	}, [token, navigate]);

	const handleUsernameChange = async (e: any) => {
		e.preventDefault();
		try {
			await axios({
				method: 'POST',
				url: 'http://localhost:5000/settingsChange',
				data: { token: token, data: { newUsername: newUsername } },
			}).then(response => {
				if (response.data.status === 'error') {
					alert(response.data.error);
					console.log(response.data.error);
					setNewUsername('');
					console.log(newUsername);
				} else {
					console.log(response.data.data);
					setNewUsername('');
					alert("You'll need to login again");
					setTimeout(() => {
						localStorage.removeItem('token');
						setUser(null);
						navigate('/login');
					}, 2000);
				}
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handleFullNameChange = async (e: any) => {
		e.preventDefault();
		try {
			await axios({
				method: 'POST',
				url: 'http://localhost:5000/settingsChange',
				data: { token: token, data: { fullName: fullName } },
			}).then(response => {
				if (response.data.status === 'error') {
					alert(response.data.error);
					console.log(response.data.error);
				} else {
					console.log(response.data.data);
					setFullName('');
				}
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Navbar />
			<div className="settings">
				{user && (
					<>
						<div className="settings__sidebar">
							<p
								onClick={() => {
									setCurrent('profile');
								}}
							>
								Profile
							</p>
						</div>
						<div className="settings__content">
							{current === 'profile' && (
								<>
									<h1>Profile Page</h1>
									<div className="changeUsernameContainer">
										<form
											className="changeUsernameForm"
											onSubmit={handleUsernameChange}
										>
											<label htmlFor="">Choose your new Username</label>
											<div>
												<input
													className="profile__change"
													type="text"
													aria-label="Change Username"
													placeholder="Your New Username"
													onChange={e => {
														setNewUsername(e.target.value);
													}}
													value={newUsername}
												/>
												<button type="submit" className="confirmButton">
													<CheckIcon />
												</button>
											</div>
										</form>
									</div>
									<div className="changeFullNameContainer">
										<form
											className="changeFullNameForm"
											onSubmit={handleFullNameChange}
										>
											<label htmlFor="">Tell us your Full Name</label>
											<div>
												<input
													className="profile__change"
													type="text"
													aria-label="Change Username"
													placeholder="Your Full Name"
													onChange={e => {
														setFullName(e.target.value);
													}}
													value={fullName}
												/>
												<button type="submit" className="confirmButton">
													<CheckIcon />
												</button>
											</div>
											<em>We'll never share your data with third parties.</em>
										</form>
									</div>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</>
	);
}

export default Settings;
