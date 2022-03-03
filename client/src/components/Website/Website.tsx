import './Website.css';
import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { v4 as uuidv4 } from 'uuid';

function Website({
	websitePassword,
	websiteName,
	index,
	websiteEmail,
}: {
	websitePassword: string;
	websiteName: string;
	index: number;
	websiteEmail: string;
}): JSX.Element {
	const [visible, setVisible] = useState<boolean>(false);

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
			<div className="email__container">
				<input
					className="websiteEmail"
					type="text"
					value={websiteEmail}
					readOnly
					key={index}
					id={index.toString()}
				/>
				<button
					onClick={copyEmail}
					className="copyButton"
					id={index.toString()}
				>
					<ContentCopyIcon
						className="copyIcon"
						sx={{ fontSize: 'medium' }}
						id={index.toString()}
					/>
				</button>
			</div>
			<div className="input__container">
				<input
					className="websitePassword"
					type={visible ? 'text' : 'password'}
					value={websitePassword}
					readOnly
					key={index}
					id={index.toString()}
				/>
				<button
					onClick={copyPassword}
					className="copyButton"
					id={index.toString()}
				>
					<ContentCopyIcon
						className="copyIcon"
						sx={{ fontSize: 'medium' }}
						id={index.toString()}
					/>
				</button>
				<input type="checkbox" onClick={() => setVisible(!visible)} />
			</div>
		</div>
	);
}

export default Website;
