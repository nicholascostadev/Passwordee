import './Website.css';
import { useState } from 'react';

function Website({
	websitePassword,
	websiteName,
}: {
	websitePassword: string;
	websiteName: string;
}): JSX.Element {
	const [visible, setVisible] = useState<boolean>(false);

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
				/>
				<button></button>
				<input type="checkbox" onClick={() => setVisible(!visible)} />
			</div>
		</div>
	);
}

export default Website;
