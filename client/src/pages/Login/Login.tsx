import axios from 'axios';
import { useState } from 'react';
import Navbar from '../../Navbar/Navbar';
import './Login.css';

function Login() {
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
		// post request to Database and saves it inside loggedUser(it only receives now an email)
		e.preventDefault();
		await axios({
			method: 'post',
			url: 'http://localhost:5000/login',
			data: user,
		}).then(response => {
			if (response.data.status === 'ok') {
				localStorage.setItem('token', response.data.token);
				document.location.reload();
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
