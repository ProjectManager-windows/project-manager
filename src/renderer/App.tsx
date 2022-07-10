import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './styles/reset.scss';
import './styles/App.scss';
import Footer                                    from './components/Footer';
import Project                                   from './pages/Project';
import Settings                                  from './pages/Settings';

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
