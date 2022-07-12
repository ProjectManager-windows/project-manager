import '../styles/project.scss';
import Menu from '../components/project/menu';

const Project = () => {
	return (
		<div className='project'>
			<div className='grid'>
				<div className='tools'>
					<Menu/>
				</div>
				<div className='projects'>
					test
				</div>
				<div className='technologies'>
					test2
				</div>
				<div className='view'>
					test3
				</div>
			</div>
		</div>
	);
};

export default Project;
