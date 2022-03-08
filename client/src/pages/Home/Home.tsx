import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Home.css';

function Home() {
	// Right now there is nothing on homepage, later I'll create
	// a landing page showing the webapp, like other websites do.
	const [token, setToken] = useState<string | null>();
	let navigate = useNavigate();

	// Check if there is a token(if user has logged in), if false, redirect to login
	// if true, redirect to dashboard.
	// The logic is that because I didn't make a landing page for the project yet.
	useEffect(() => {
		const _token = localStorage.getItem('token');
		setToken(_token);
		if (token === null) {
			navigate('/login');
		} else {
			navigate('/dashboard');
		}
	}, [token, navigate]);

	return (
		<div className="home">
			<Navbar />
		</div>
	);
}

export default Home;
