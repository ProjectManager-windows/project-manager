import JSON5 from 'json5';

export class Stored {
	static toObject<T>(project: T) {
		return JSON5.parse(JSON5.stringify(project));
	}

	static fromObject<C, D>(cls: any, data: D): C {
		// eslint-disable-next-line new-cap
		return new cls(
			{
				...data
			}
		) as C;
	}
}

export default Stored;
