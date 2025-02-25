import type { OnError } from '../../types/errors.type';
import type { Transformer } from '../../types/map.type';

/**
 * @description
 * Use this helper to transform an array of items into a new array of items.
 *
 * This function behaves similarly to `Array.prototype.map`, but with added error handling:
 * - If the transformer throws an error for any element, the error is handled via the onError callback.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to transform.
 * @param {Transformer<TInput>} transformer The function that transforms the items. Called once for each item in the array.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 *
 * @returns {Array<TOutput>} A new array with the results of the transformation.
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
