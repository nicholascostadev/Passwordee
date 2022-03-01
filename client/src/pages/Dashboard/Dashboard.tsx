import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../Interfaces';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Website from '../../components/Websites/Website';
import CloseIcon from '@mui/icons-material/Close';

function Dashboard() {
	interface Website {
		name: string;
		password: string;
		index: number;
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
	console.log(websites);
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
		} else {
			console.log('NO user');
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
					console.log(response.data);
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
								console.log(website);
								return (
									<Website
										websiteName={website.name}
										websitePassword={website.password}
										key={index}
										index={index}
									/>
								);
							})}
					</div>
					{create ? (
						<>
							<form onSubmit={handleAddWebsite} className="addWebsiteForm">
								<h1>Save a new Website</h1>
								<label>Name</label>
								<input
									type="text"
									className="formInput"
									placeholder="Name"
									onChange={e =>
										setNewWebsite({ ...newWebsite, name: e.target.value })
									}
								/>
								<label>URL</label>
								<input
									type="url"
									className="formInput"
									placeholder="https://website.com"
									onChange={e =>
										setNewWebsite({ ...newWebsite, url: e.target.value })
									}
								/>
								<label>Email</label>
								<input
									type="email"
									className="formInput"
									placeholder="example@email.com"
									onChange={e =>
										setNewWebsite({ ...newWebsite, email: e.target.value })
									}
								/>
								<label>Password</label>
								<input
									type="password"
									className="formInput"
									placeholder="password"
									onChange={e =>
										setNewWebsite({ ...newWebsite, password: e.target.value })
									}
								/>
								<button type="submit" className="websiteFormSubmitButton">
									Save
								</button>
							</form>
						</>
					) : null}
					{/* boxes with image and name of website. email and password(initially hidden) */}
				</div>
			)}

			{user && create ? <div className="blurredBackground"></div> : null}
			{user && create ? (
				<CloseIcon className="closeIcon" onClick={() => setCreate(false)} />
			) : null}
		</div>
	);
}

export default Dashboard;
