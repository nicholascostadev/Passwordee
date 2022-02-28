import './App.css';
import Navbar from './Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<div>
								<Navbar />
							</div>
						}
					/>
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
