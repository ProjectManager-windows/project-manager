import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import icon                                      from '../../assets/icon.svg';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './styles/reset.scss';
import './styles/App.scss';
import './styles/Hello.scss';
import Footer        from './components/Footer';

const Hello = () => {
	return (
		<div>
			<div className='Hello'>
				<img width='200px' alt='icon' src={icon} />
			</div>
			<h1>electron-react-boilerplate</h1>
			<div className='Hello'>
				<a
					href='https://electron-react-boilerplate.js.org/'
					target='_blank'
					rel='noreferrer'
				>
					<button type='button'>
            <span role='img' aria-label='books'>
              📚
            </span>
						Read our docs
					</button>
				</a>
				<a
					href='https://github.com/sponsors/electron-react-boilerplate'
					target='_blank'
					rel='noreferrer'
				>
					<button type='button'>
            <span role='img' aria-label='books'>
              🙏
            </span>
						Donate
					</button>
				</a>
			</div>
		</div>
	);
};

export default function App() {
	return (
		<div>
			<Router>
				<Routes>
					<Route path='/' element={<Hello />} />
				</Routes>
			</Router>
			<Footer />
		</div>
	);
}
