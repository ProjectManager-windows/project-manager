import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import Footer                                    from './components/Footer';
import Project                                   from './pages/Project';
import Settings                                  from './pages/Settings';
import './styles/App.scss';

export default function App() {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route path='/' element={<Project />} />
					<Route path='/settings' element={<Settings />} />
				</Routes>
				<Footer />
			</Router>
		</div>
	);
}
