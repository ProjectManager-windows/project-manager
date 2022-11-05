import '../styles/programs/programs.scss';
import { useNavigate }                             from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { Tooltip }                                 from 'primereact/tooltip';
import ProgramList                    from '../components/Programs/ProgramList';
import ProgramEditor                  from '../components/Programs/ProgramEditor';
import { ProgramFields, ProgramType } from '../../types/project';
import ProgramCreate                  from '../components/Programs/ProgramCreate';

const Programs = () => {
	const navigate                         = useNavigate();
	const [programs, setPrograms]          = useState(window.electron.programs.getAll());
	const [selectedProgram, selectProgram] = useState<ProgramFields>();
	useEffect(() => {
		return window.electron.programs.onUpdate(() => {
			setPrograms(window.electron.programs.getAll());
		});
	}, []);
	const select        = (e: React.MouseEvent<HTMLDivElement>, program: ProgramFields) => {
		e.preventDefault();
		selectProgram(program);
	};
	const createProgram = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		selectProgram({ color: '', executeCommand: '', executePath: '', id: -1, label: '', logo: '', name: '', type: ProgramType.other });
	};
	const deleteProgram = useCallback((Program:ProgramFields) => {
		if (parseInt(String(Program.id), 10) === parseInt(window.electron.settings.get(`default.${Program.type}`), 10)) {
			window.electron.settings.del(`default.${Program.type}`);
		}
		window.electron.programs.delete(Program.id);
		selectProgram(undefined)

	}, []);
	return (
		<div className='Programs'>
			<Tooltip target='.tp' position='top' mouseTrack mouseTrackTop={10} />
			<i onClick={() => navigate(-1)} className='back-link iBtn pi pi-arrow-left' />
			<ProgramList Programs={programs} onSelect={select} createProgram={createProgram} />
			{selectedProgram && selectedProgram.id && selectedProgram.id > 0 ?
			 <ProgramEditor Program={selectedProgram} deleteProgram={deleteProgram} />
																			 :
			 <ProgramCreate />
			}
		</div>
	);
};

export default Programs;
