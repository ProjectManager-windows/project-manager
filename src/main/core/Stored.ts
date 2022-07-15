export class Stored {
	static toObject<T>(project: T) {
		return JSON.parse(JSON.stringify(project));
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
