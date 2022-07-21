import { useEffect, useState } from 'react';

export const useCommit = <T, >(initState: T, change: (value: T) => void) => {
	const [state, setState]         = useState<T>();
	const [isChanged, setIsChanged] = useState(false);
	useEffect(() => {
		setState(initState);
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
		if (value === undefined) {
			if (state) {
				change(state);
				setIsChanged(false);
			}
		} else {
			change(value);
			setIsChanged(false);
		}
	}

	return [state, setValue, commit, isChanged];
};
export default useCommit;

