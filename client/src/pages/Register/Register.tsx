import './Register.css';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../../Navbar/Navbar';

const Register: React.FC = () => {
	interface User {
		email: string;
		password: string;
	}

	const [user, setUser] = useState<User>({
		password: '',
		email: '',
	});

	const handleRegister = async (
		e: React.ChangeEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		await axios({
			method: 'post',
			url: 'http://localhost:5000/register',
			data: user,
		}).then(response => {
			if (response.data.status === 'ok') {
				return;
			} else {
				alert(response.data.error);
			}
		});
		window.history.replaceState(null, document.title, window.location.pathname);
	};
	return (
		<div className="register">
			<Navbar />
			<div className="register__formContainer">
				<form onSubmit={handleRegister}>
					<h1>Register</h1>
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
					<button className="register__button" type="submit">
						Submit
					</button>
				
				</form>
			</div>
		</div>
	);
};

export default Register;
