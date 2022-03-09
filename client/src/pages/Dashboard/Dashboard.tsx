import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../Interfaces';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Website from '../../components/Website/Website';
import AddWebsite from '../../components/AddWebsite/AddWebsite';

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
						// For more comprehensive code, created a component for the form
						<AddWebsite token={token} key={15 * 23} />
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
