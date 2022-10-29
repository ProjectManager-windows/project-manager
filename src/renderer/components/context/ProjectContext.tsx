import { createContext } from 'react';
import { ProjectType }   from '../../../types/project';

export type projectContext = {
	projects: ProjectType[],
	setProjects?: (value: { [key: string]: any }) => void,
	selectedProject?: ProjectType,
	selectProject?: (value: any) => void,
	view?: any,
	setView?: (value: any) => void,
	technology?: string,
	setTechnology?: (value: string) => void,
	ides?: { [key: string]: any },
	terminals?: { [key: string]: any },
}
export const ProjectContext = createContext<projectContext>({ projects: [] }

);
