import { useMemo }     from 'react';
import * as JsSearch   from 'js-search';
import { ProjectType } from '../../../types/project';

export const useSearch = (props: { projects: { [key: string]: ProjectType }, searchString: string }) => {
	const { projects, searchString } = props;
	const projectList                = Object.values(projects);

	return useMemo(() => {
		if (searchString) {
			const search = new JsSearch.Search('id');
			search.addIndex('name');
			search.addIndex('path');
			search.addDocuments(projectList);
			return search.search(searchString);
		}
		return projectList;
	}, [projectList, searchString]);
};
export default useSearch;
