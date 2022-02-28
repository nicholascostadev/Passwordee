import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../Interfaces';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Website from '../../components/Websites/Website';

function Dashboard() {
	interface Website {
		name: string;
		password: string;
	}

	interface Websites extends Array<Website> {}

	const [user, setUser] = useState<User | null>();
	const [token, setToken] = useState<string | null>();
	const [websites, setWebsites] = useState<Websites>();
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

	return (
		<div className="dashboard">
			<Navbar />
			{user && (
				<div className="dashboard__content">
					<h1>Hello, {user.email}, Welcome back!</h1>
					<div>
						{websites &&
							websites.map((website: Website, index: number) => {
								console.log(website);
								return (
									<Website
										websiteName={website.name}
										websitePassword={website.password}
										key={index}
									/>
								);
							})}
					</div>
					{/* boxes with image and name of website. email and password(initially hidden) */}
				</div>
			)}
		</div>
	);
}

export default Dashboard;
