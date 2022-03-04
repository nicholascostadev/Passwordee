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

	const [user, setUser] = useState<User | null>();
	const [token, setToken] = useState<string | null>();
	const [websites, setWebsites] = useState<Websites>();
	const [create, setCreate] = useState<boolean>();
	const [newWebsite, setNewWebsite] = useState<{
		name: string;
		url: string;
		email: string;
		password: string;
	}>({ name: '', url: '', email: '', password: '' });
	let navigate = useNavigate();

	useEffect(() => {
		if (user) {
			axios({
				method: 'post',
				url: 'http://localhost:5000/getWebsitesData',
				data: {
					id: user.id,
					email: user.email,
				},
			}).then(response => {
				if (response.data.status === 'error') {
					alert(response.data.error);
				} else {
					setWebsites(response.data.websites[0]);
				}
			});
		}
	}, [user]);

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

	const handleAddWebsite = async (e: any) => {
		e.preventDefault();
		try {
			await axios({
				method: 'POST',
				url: 'http://localhost:5000/saveNewWebsite',
				data: { newWebsite, token: token },
			}).then(response => {
				if (response.data.status === 'error') {
					alert(response.data.error);
				} else {
					setNewWebsite({ name: '', url: '', email: '', password: '' });
					navigate('/');
				}
			});
		} catch (err) {
			console.log(err);
		}
	};

	const deleteFunction = async (websiteEmail: string, websiteName: string) => {
		try {
			await axios({
				method: 'DELETE',
				url: 'http://localhost:5000/deleteWebsite',
				data: {
					token: localStorage.getItem('token'),
					data: { email: websiteEmail, websiteName: websiteName },
				},
			}).then(response => {
				if (response.data.status === 'error') {
					console.log(response.data.error);
				} else {
					console.log(response.data.data);
				}
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="dashboard">
			<Navbar />
			{user && (
				<div className="dashboard__content">
					<h1>Hello, {user.email}, Welcome back!</h1>
					<button className="addWebsite" onClick={() => setCreate(true)}>
						Add Website
					</button>
					<div>
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
					{create ? (
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
					) : null}
				</div>
			)}

			{user && create ? (
				<div
					className="blurredBackground"
					onClick={() => setCreate(false)}
				></div>
			) : null}
		</div>
	);
}

export default Dashboard;
