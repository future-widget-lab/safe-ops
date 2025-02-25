import type { OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to return the elements of an array that meet the condition specified in a callback function.
 *
 * This function behaves similarly to `Array.prototype.filter`, but with added error handling:
 * - If the predicate throws an error for any element, the error is handled via the onError callback.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to filter.
 * @param {Predicate<TInput>} predicate A function that tests each element of the array. Called once for each item in the array.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 *
 * @returns {Array<TInput>} An array of items that match the predicate.
 */
export const safeFilter = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): Array<TInput> => {
	const { onError = () => {} } = options;

	const results: Array<TInput> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (matches) {
				results.push(item);
			}
		} catch (error) {
			onError(error, item, index);
		}
	}

	return results;
};
