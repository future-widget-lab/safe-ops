import type { OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to find the index of the first element in an array that satisfies a specified test.
 *
 * This function behaves similarly to `Array.prototype.findIndex`, but with added error handling:
 * - If the predicate throws an error for any element, the error is handled via the onError callback.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to test.
 * @param {Predicate<TInput>} predicate A function that tests each element of the array. Called once for each item in the array.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 *
 * @returns {number} The index of the first element that satisfies the test. Returns -1 if no element matches.
 */
export const safeFindIndex = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): number => {
	const { onError = () => {} } = options;

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			if (predicate(item, index, collection)) {
				return index;
			}
		} catch (error) {
			onError(error, item, index);
		}
	}

	return -1;
};
