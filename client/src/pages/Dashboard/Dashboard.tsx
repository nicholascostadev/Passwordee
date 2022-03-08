import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../Interfaces';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Website from '../../components/Website/Website';

function Dashboard() {
	interface Website {
		name: string;
		password: string;
		index: number;
		email: string;
	}

	interface Websites extends Array<Website> {}

	// States

	// the user is set from his decoded token
	const [user, setUser] = useState<User | null>();

	// We don't use only the token because the token may be invalid
	// so we set the user if the token is valid so that we make verification
	// if user is logged in, only with valid tokens
	const [token, setToken] = useState<string | null>();

	// The websites that will appear from dashboard(taken from the DB with use of axios)
	const [websites, setWebsites] = useState<Websites>();

	// See if user is on the create state, if true, show the addWebsite formulary
	const [create, setCreate] = useState<boolean>();

	// set the newWebsite after completing the form to send to DB
	const [newWebsite, setNewWebsite] = useState<{
		name: string;
		url: string;
		email: string;
		password: string;
	}>({ name: '', url: '', email: '', password: '' });

	// Make it a global variable to be easier to access with "navigate" name
	let navigate = useNavigate();

	// Get the token from the user when he enters the page
	useEffect(() => {
		const _token = localStorage.getItem('token');

		setToken(_token);

		if (token === null) {
			navigate('/login');
		} else if (token) {
			const data: User = jwt_decode(token);

			// Set the user, doing that, the user can't be a null value
			setUser(data);
		}
	}, [token, navigate]);

	useEffect(() => {
		if (user) {
			// If there is an actual user(like stated on the beginning)
			// render all the websites he already has saved
			try {
				axios({
					method: 'post',
					url: 'http://localhost:5000/getWebsitesData',
					// The data being sent is from the token
					data: {
						id: user.id,
						email: user.email,
					},
				}).then(response => {
					if (response.data.status === 'error') {
						alert(response.data.error);
					} else {
						// Set the websites to be shown
						setWebsites(response.data.websites[0]);
					}
				});
			} catch (err) {
				alert(err);
			}
		}
	}, [user]);

	const handleAddWebsite = async (e: any) => {
		e.preventDefault();

		// Post the data received from the form.
		try {
			await axios({
				method: 'POST',
				url: 'http://localhost:5000/saveNewWebsite',
				// Just to make sure the user hasn't been manipulated in some way,
				// we send the token to the backend, and then the token is validated
				// there.
				data: { newWebsite, token: token },
			}).then(response => {
				if (response.data.status === 'error') {
					alert(response.data.error);
				} else {
					// Reset the form and "refresh" the page after user saved, using the navigate().
					setNewWebsite({ name: '', url: '', email: '', password: '' });
					navigate('/');
				}
			});
		} catch (err) {
			// Log the error(only for development)
			console.log(err);
		}
	};

	const deleteFunction = async (websiteEmail: string, websiteName: string) => {
		// Deleting a website
		try {
			await axios({
				method: 'DELETE',
				url: 'http://localhost:5000/deleteWebsite',
				data: {
					// Send the token to identify user and the data of
					// the website to be deleted.
					token,
					data: { email: websiteEmail, websiteName: websiteName },
				},
			}).then(response => {
				if (response.data.status === 'error') {
					console.log(response.data.error);
				} else {
					console.log(response.data.data);

					// navigate to the same page to refresh the UI after deletion.
					navigate('/');
				}
			});
		} catch (err) {
			console.log(err);
		}
	};

	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			setCreate(false);
		}
	});

	return (
		<div className="dashboard">
			<Navbar />

			{user && (
				<div className="dashboard__content">
					<h1>Hello, {user.username || user.email}, Welcome back!</h1>
					<button className="addWebsite" onClick={() => setCreate(true)}>
						Add Website
					</button>
					<div>
						{/* Loop and render all the websites */}
						{websites &&
							websites.map((website: Website, index: number) => {
								return (
									<Website
										websiteName={website.name}
										websitePassword={website.password}
										websiteEmail={website.email}
										key={index * 5}
										index={index}
										deleteFunction={deleteFunction}
									/>
								);
							})}
					</div>
					{create && (
						<>
							<form onSubmit={handleAddWebsite} className="addWebsiteForm">
								<h1>Save a new Website</h1>
								<label style={{ fontWeight: 'bold' }}>
									Choose your image
									<em style={{ fontWeight: 'normal' }}>
										(If you don't have one, don't worry, we will try to find an
										adequate one).
									</em>
								</label>
								<input
									className="newWebsiteImage"
									type="file"
									accept="image/png, image/jpeg"
								/>

								<label>Name</label>
								<input
									type="text"
									className="formInput"
									placeholder="Name"
									onChange={e =>
										setNewWebsite({ ...newWebsite, name: e.target.value })
									}
									required
									value={newWebsite.name}
								/>
								<label>URL</label>
								<input
									type="url"
									className="formInput"
									placeholder="website.com"
									pattern="https://[A-Za-z]+[A-Za-z0-9\.-]*"
									onChange={e =>
										setNewWebsite({ ...newWebsite, url: e.target.value })
									}
									value={newWebsite.url}
									required
								/>
								<label>Email</label>
								<input
									type="email"
									className="formInput"
									placeholder="example@email.com"
									onChange={e =>
										setNewWebsite({ ...newWebsite, email: e.target.value })
									}
									required
									value={newWebsite.email}
								/>
								<label>Password</label>
								<input
									type="password"
									className="formInput"
									placeholder="password"
									onChange={e =>
										setNewWebsite({ ...newWebsite, password: e.target.value })
									}
									required
									value={newWebsite.password}
								/>
								<button type="submit" className="websiteFormSubmitButton">
									Save
								</button>
							</form>
						</>
					)}
				</div>
			)}

			{user && create ? (
				// check again if there is an user
				// and if he is on create state(showing the form)
				// if true, create a div full width of the screen, darkening the background
				<div
					className="blurredBackground"
					onClick={() => setCreate(false)}
				></div>
			) : null}
		</div>
	);
}

export default Dashboard;
