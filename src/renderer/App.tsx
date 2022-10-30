import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { Toast }                                 from 'primereact/toast';
import { useEffect, useRef, useState }           from 'react';
import Footer                                    from './components/Footer';
import Project                                   from './pages/Project';
import Settings                                  from './pages/Settings';
import './styles/App.scss';
import Ides                                      from './pages/Ides';
import Menu                                      from './components/Menu';
import { AppContext }                            from './components/context/AppContext';
import Terminals                                 from './pages/Teminals';
import { NotificationItemInterface }             from './classes/Notifications';
import Programs                                  from './pages/Programs';

export default function App() {
	const toast                         = useRef(null);
	const [notificationList, setNotify] = useState<NotificationItemInterface[]>([]);
	const [showNotify, setShowNotify]   = useState<boolean>(false);
	const updateNotify                  = () => {
		setNotify(Object.values(window.Notifications.Notifications));
	};
	useEffect(() => {
		window.Notifications.on('update', updateNotify);
		return () => {
			window.Notifications.off('update', updateNotify);
		};
	}, []);
	return (
		<AppContext.Provider value={{ toast, notificationList, showNotify, setShowNotify }}>
			<Toast ref={toast} />
			<div className='App'>
				<Router>
					<Menu />
					<div className='wrapper'>
						<Routes>
							<Route path='/' element={<Project />} />
							<Route path='/settings' element={<Settings />} />
							<Route path='/ides' element={<Ides />} />
							<Route path='/terminals' element={<Terminals />} />
							<Route path='/programs' element={<Programs />} />
						</Routes>
					</div>
					<Footer />
				</Router>
			</div>
		</AppContext.Provider>
	);
}
