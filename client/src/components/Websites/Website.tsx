import './Website.css';
import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function Website({
	websitePassword,
	websiteName,
	key,
	index,
}: {
	websitePassword: string;
	websiteName: string;
	key: number;
	index: number;
}): JSX.Element {
	const [visible, setVisible] = useState<boolean>(false);

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
			<div className="input__container">
				<input
					className="websitePassword"
					type={visible ? 'text' : 'password'}
					value={websitePassword}
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
