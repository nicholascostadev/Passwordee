import './Website.css';
import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';

function Website({
	websitePassword,
	websiteName,
	index,
	websiteEmail,
	deleteFunction,
}: {
	websitePassword: string;
	websiteName: string;
	index: number;
	websiteEmail: string;
	deleteFunction: (websiteEmail: string, websiteName: string) => void;
}): JSX.Element {
	const [visible, setVisible] = useState<boolean>(false);

	// Logic for copying email.
	const copyEmail = (e: any) => {
		const emailInputs = document.querySelectorAll('.websiteEmail');
		console.log(emailInputs);
		let correctIndex = Number(e.target.id);
		console.log('Correct Index', correctIndex);
		emailInputs.forEach((email: any) => {
			if (Number(email.id) === correctIndex) {
				navigator.clipboard.writeText(email.value);
			}
		});
	};

	// Logic copying password.
	const copyPassword = (e: any) => {
		const passwordInputs = document.querySelectorAll('.websitePassword');
		console.log(passwordInputs);
		let correctIndex = Number(e.target.id);
		console.log('Correct Index', correctIndex);
		passwordInputs.forEach((password: any) => {
			if (Number(password.id) === correctIndex) {
				navigator.clipboard.writeText(password.value);
			}
		});
	};

	return (
		<div className="websiteData">
			<p>{websiteName}</p>
			<img
				className="websiteImage"
				src="https://files.tecnoblog.net/wp-content/uploads/2021/10/logotipo-da-empresa-amazon.png"
				alt="amazon-logo"
			/>
			<button
				className="deleteWebsiteButton"
				id={index.toString()}
				onClick={(e: any) => deleteFunction(websiteEmail, websiteName)}
			>
				<ClearIcon />
			</button>
			<div className="email__container">
				<input
					className="websiteEmail"
					type="text"
					value={websiteEmail}
					readOnly
					key={index}
				/>
				<button onClick={copyEmail} className="copyButton">
					<ContentCopyIcon className="copyIcon" sx={{ fontSize: 'medium' }} />
				</button>
			</div>
			<div className="input__container">
				<input
					className="websitePassword"
					type={visible ? 'text' : 'password'}
					value={websitePassword}
					readOnly
					key={index}
				/>
				<button onClick={copyPassword} className="copyButton">
					<ContentCopyIcon className="copyIcon" sx={{ fontSize: 'medium' }} />
				</button>
				<input type="checkbox" onClick={() => setVisible(!visible)} />
			</div>
		</div>
	);
}

export default Website;
