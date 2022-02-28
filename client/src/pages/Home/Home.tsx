import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Home.css';

function Home() {
	const [token, setToken] = useState<string | null>();
	let navigate = useNavigate();
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
