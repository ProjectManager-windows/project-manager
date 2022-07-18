import { createContext } from 'react';

export const ProjectContext = createContext({
												projects       : {},
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
												}
											} as {
												projects: { [key: string]: any },
												setProjects?: (value: { [key: string]: any }) => void,
												selectedProject?: any,
												selectProject?: (value: any) => void,
												view?: any,
												setView?: (value: any) => void,
												technology?: string,
												setTechnology?: (value: string) => void,
											}
);
