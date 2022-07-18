import { createContext } from 'react';

export const AppContext = createContext({
												toast: null
											} as {
												toast: any,
											}
);
