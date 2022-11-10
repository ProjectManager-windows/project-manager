import { useMemo }     from 'react';
import * as JsSearch   from 'js-search';
import { ProjectType } from '../../../types/project';

export const useSearch = (props: { projects: { [key: string]: ProjectType }, searchString: string }): ProjectType[] => {
	const { projects, searchString } = props;
	const projectList                = useMemo(() => {
		return Object.values(projects).map(e => {
			if (e.stats) {
				const g   = Object.entries(e.stats);
				let total = 0;
				g.forEach(([_, v]) => {
					total += v;
				});
				g.forEach(([k, v]) => {
					if (e.stats) e.stats[k] = (v / total) * 1000;
				});
				// @ts-ignore
				e._stats = Object.entries(e.stats).map(([l, r]) => {
					return window.LanguagesExtensions.find((el) => {
						if (r < 30) return false;
						return el?.extensions?.includes(l);
					})?.name.toLowerCase();
				}).filter((v) => !!v);
			}
			return e;
		});
	}, [projects]);

	function getSearchEngine() {
		const search         = new JsSearch.Search('id');
		search.searchIndex   = new JsSearch.UnorderedSearchIndex();
		search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
		return search;
	}

	const search = useMemo(() => {
		const search = getSearchEngine();
		search.addIndex('name');
		search.addDocuments(projectList);
		return search;
	}, [projectList]);

	const search2 = useMemo(() => {
		const search = getSearchEngine();
		search.addIndex('path');
		search.addIndex('description');
		search.addIndex('_stats');
		search.addDocuments(projectList);
		return search;
	}, [projectList]);

	return useMemo(() => {
		if (searchString) {
			const a = search.search(searchString) as ProjectType[];
			const a2 = search2.search(searchString) as ProjectType[];
			const set = new Set([...a,...a2])
			return [...set];
		}
		return projectList;
	}, [projectList, search, searchString]);
};
export default useSearch;
