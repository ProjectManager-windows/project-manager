import { createContext } from 'react';
import { ProjectType }   from '../../../types/project';

export const ProjectContext = createContext({
												projects       : [],
												setProjects    : () => {
												},
												selectedProject: {},
												selectProject  : () => {
												},
												view           : (<div />),
												setView        : () => {
												},
												technology     : '',
												setTechnology  : () => {
												},
												ides           : {}
											} as {
												projects: ProjectType[],
												setProjects?: (value: { [key: string]: any }) => void,
												selectedProject?: any,
												selectProject?: (value: any) => void,
												view?: any,
												setView?: (value: any) => void,
												technology?: string,
												setTechnology?: (value: string) => void,
												ides?: { [key: string]: any },
											}
);
