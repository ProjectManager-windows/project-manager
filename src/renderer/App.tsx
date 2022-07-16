import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import Footer                                    from './components/Footer';
import Project                                   from './pages/Project';
import Settings                                  from './pages/Settings';
import './styles/App.scss';
import Ides                                      from './pages/Ides';
import Menu                                      from './components/menu';

export default function App() {
	return (
		<div className='App'>
			<Router>
				<Menu />
				<div className='wrapper'>
					<Routes>
						<Route path='/' element={<Project />} />
						<Route path='/settings' element={<Settings />} />
						<Route path='/ides' element={<Ides />} />
					</Routes>
				</div>
				<Footer />
			</Router>
		</div>
	);
}
