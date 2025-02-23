/**
 * @description
 * Use this helper to safely transform a collection without worrying about runtime errors.
 *
 * If an error occurs during transformation, the item is skipped.
 */
export const safeMap = <TInput, TOutput>(
	collection: Array<TInput>,
	transformer: (item: TInput, index: number, array: Array<TInput>) => TOutput,
	options?: {
		onError?: (error: unknown, item: TInput, index: number) => void;
	}
): Array<TOutput> => {
	const { onError = () => {} } = options ?? {};

	return collection.reduce<Array<TOutput>>((accumulated, item, index, array) => {
		try {
			accumulated.push(transformer(item, index, array));
		} catch (error) {
			onError(error, item, index);
		}

		return accumulated;
	}, []);
};
