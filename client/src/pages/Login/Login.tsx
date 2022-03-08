import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Login.css';

function Login() {
	const [token, setToken] = useState<string | null>();
	let navigate = useNavigate();

	useEffect(() => {
		const _token = localStorage.getItem('token');
		setToken(_token);
		if (token) {
			navigate('/dashboard');
			console.log('No token', token);
		} else {
			return;
		}
	}, [token, navigate]);

	interface User {
		email: string;
		password: string;
	}

	const [user, setUser] = useState<User>({
		password: '',
		email: '',
	});

	const handleLogin = async (
		e: React.ChangeEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		await axios({
			method: 'post',
			url: 'http://localhost:5000/login',
			// User data from the form, checked in the back-end
			data: user,
		}).then(response => {
			if (response.data.status === 'ok') {
				localStorage.setItem('token', response.data.token);
				navigate('/login')
			} else {
				alert(response.data.error);
			}
		});
	};
	return (
		<div className="login">
			<Navbar />
			<div className="login__formContainer">
				<form onSubmit={handleLogin}>
					<h1>Login</h1>
					<label>Email</label>
					<input
						type="email"
						name="email"
						id=""
						placeholder="email@example.com"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setUser({
								...user,
								email: e.target.value,
							})
						}
					/>
					<label>Password</label>
					<input
						type="password"
						name="password"
						id=""
						placeholder="password"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setUser({
								...user,
								password: e.target.value,
							})
						}
					/>
					<button className="login__button" type="submit">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
