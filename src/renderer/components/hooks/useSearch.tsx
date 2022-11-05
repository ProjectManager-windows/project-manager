import { useMemo }     from 'react';
import * as JsSearch   from 'js-search';
import { ProjectType } from '../../../types/project';

export const useSearch = (props: { projects: { [key: string]: ProjectType }, searchString: string }): ProjectType[] => {
	const { projects, searchString } = props;
	const projectList                = useMemo(() => {
		return Object.values(projects).map(e => {
			if (e.stats) {
				// @ts-ignore
				e._stats = Object.keys(e.stats).map((l) => {
					return window.LanguagesExtensions.find((el) => {
						return el?.extensions?.includes(l);
					})?.name.toLowerCase();
				}).filter((v) => !!v);
			}
			return e;
		});
	}, [projects]);


	const search = useMemo(() => {
		const search = new JsSearch.Search('id');
		search.addIndex('name');
		search.addIndex('path');
		search.addIndex('description');
		search.addIndex('_stats');
		search.addDocuments(projectList);
		return search;
	}, [projectList]);

	return useMemo(() => {
		if (searchString) {
			const a =search.search(searchString) as ProjectType[];
			console.log(a);
			return a
		}
		return projectList;
	}, [projectList, search, searchString]);
};
export default useSearch;
