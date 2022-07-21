import { useEffect, useState } from 'react';

export const useCommit = <T, >(initState: T, change: (value: T) => void) => {
	const [state, setState]         = useState<T>();
	const [isChanged, setIsChanged] = useState(false);
	useEffect(() => {
		if(initState !== undefined) {
			setState(initState);
		}else{
			// @ts-ignore
			setState(null);
		}
	}, [initState]);


	function setValue(value: T) {
		if (state !== value) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
		setState(value);
	}

	function commit(value?: T) {
		if(value === undefined) {
			// @ts-ignore
			change(state);
			setIsChanged(false);
		}else {
			setState(value);
			change(value);
			setIsChanged(false);
		}
	}

	return [state, setValue, commit, isChanged];
};
export default useCommit;

