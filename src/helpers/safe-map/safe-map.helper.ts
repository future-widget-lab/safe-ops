import type { OnError } from '../../types/errors.type';
import type { Transformer } from '../../types/map.type';

/**
 * @description
 * Use this helper to safely transform a collection without worrying about runtime errors.
 *
 * If an error occurs during transformation, the item is skipped.
 */
export const safeMap = <TInput, TOutput>(
	collection: Array<TInput>,
	transformer: Transformer<TInput, TOutput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): Array<TOutput> => {
	const { onError } = options;

	const results: Array<TOutput> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			results.push(transformer(item, index, collection));
		} catch (error) {
			onError?.(error, item, index);
		}
	}

	return results;
};
