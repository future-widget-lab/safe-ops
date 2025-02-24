import type { ErrorReport, OnError } from '../../types/errors.type';
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
 * @returns {{ results: Array<TOutput>; errors: Array<ErrorReport<TInput>> }} A report which contains the array of items that match the predicate and the errors that occurred.
 */
export const safeMapWithErrors = <TInput, TOutput>(
	collection: Array<TInput>,
	transformer: Transformer<TInput, TOutput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { results: Array<TOutput>; errors: Array<ErrorReport<TInput>> } => {
	const { onError } = options;

	const results: Array<TOutput> = [];
	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			results.push(transformer(item, index, collection));
		} catch (error) {
			errors.push({ error: error as Error, item, index });

			onError?.(error, item, index);
		}
	}

	return { results, errors };
};
