/**
 * @description
 * Use this helper to safely find an item in a collection without worrying about runtime errors.
 *
 * If an error occurs during the predicate evaluation, the item is skipped.
 */
export const safeFind = <TInput>(
	collection: Array<TInput>,
	predicate: (item: TInput, index: number, array: Array<TInput>) => boolean,
	options: {
		onError?: (error: unknown, item: TInput, index: number) => void;
	} = {}
): TInput | undefined => {
	const { onError = () => {} } = options;

	for (let index = 0; index < collection.length; index++) {
		try {
			const matches = predicate(collection[index], index, collection);

			if (matches) {
				return collection[index];
			}
		} catch (error) {
			onError(error, collection[index], index);
		}
	}

	return undefined;
};
