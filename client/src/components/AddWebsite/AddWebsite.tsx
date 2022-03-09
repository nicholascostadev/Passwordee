import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddWebsite({ token }: { token: string | undefined | null }) {
	const [newWebsite, setNewWebsite] = useState<{
		name: string;
		url: string;
		email: string;
		password: string;
	}>({ name: '', url: '', email: '', password: '' });

	let navigate = useNavigate();

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

	return (
		<>
			<form onSubmit={handleAddWebsite} className="addWebsiteForm">
				<h1>Save a new Website</h1>
				<label style={{ fontWeight: 'bold' }}>
					Choose your image
					<em style={{ fontWeight: 'normal' }}>
						(If you don't have one, don't worry, we will try to find an adequate
						one).
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
					onChange={e => setNewWebsite({ ...newWebsite, name: e.target.value })}
					required
					value={newWebsite.name}
				/>
				<label>URL</label>
				<input
					type="url"
					className="formInput"
					placeholder="website.com"
					pattern="https://[A-Za-z]+[A-Za-z0-9\.-]*"
					onChange={e => setNewWebsite({ ...newWebsite, url: e.target.value })}
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
	);
}

export default AddWebsite;
