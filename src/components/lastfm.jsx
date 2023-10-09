import axios from 'axios';
import { useState } from 'react';

export function LastFMCollageComponent() {
	const [username, setUsername] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handleSubmit = () => {
		const requestBody = {
			username: `${username}`,
			type: "albums",
			rowNum: 6,
			colNum: 4,
			showName: false,
			hideMissing: true,
			period: "3month"
		};

		axios.post("https://lastcollage.io/api/collage", requestBody)
			.then(response => {
				setImageUrl(`https://lastcollage.io/${response.data.downloadPath}`);
			})
			.catch(error => {
				console.error('Error making request:', error);
			});
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Enter last.fm username"
				value={username}
				onChange={handleUsernameChange}
			/>
			<button onClick={handleSubmit}>Submit</button>
			{imageUrl && (
				<div>
					<h2>Collage Image</h2>
					<img src={imageUrl} alt="Collage" />
				</div>
			)}
		</div>
	);
}


export function LetterboxdCollageComponent() {
	const [username, setUsername] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handleSubmit = () => {
		const requestBody = {
			username: `${username}`,
			type: "albums",
			rowNum: 6,
			colNum: 4,
			showName: false,
			hideMissing: true,
			period: "3month"
		};
		axios.post("https://lastcollage.io/api/collage", requestBody)
			.then(response => {
				setImageUrl(`https://lastcollage.io/${response.data.downloadPath}`);
			})
			.catch(error => {
				console.error('Error making request:', error);
			});
	};
	return (
		<div>
			<input
				type="text"
				placeholder="letterboxd username"
				value={username}
				onChange={handleUsernameChange}
			/>
			<button onClick={handleSubmit}>Get Watchlist</button>
			<button onClick={handleSubmit}>Get Record</button>

			{imageUrl && (
				<div>
					<h2>Collage Image</h2>
					<img src={imageUrl} alt="Collage" />
				</div>
			)}
		</div>
	);
}

export default function LastFMPage() {

	return (
		<>
			<LastFMCollageComponent />
			<LetterboxdCollageComponent />
		</>
	)
}
