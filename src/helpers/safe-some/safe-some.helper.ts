import type { OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to determine whether at least one element in the array satisfies the specified test.
 *
 * This function behaves similarly to `Array.prototype.some`, but with added error handling:
 * - If the predicate throws an error for any element, the error is handled via the onError callback.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to test.
 * @param {Predicate<TInput>} predicate A function that tests each element of the array. Called once for each item in the array.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 *
 * @returns {boolean} Returns true if the predicate returns true for at least one element in the array. Otherwise, it returns false.
 */
export const safeSome = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): boolean => {
	const { onError = () => {} } = options;

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (matches) {
				return true;
			}
		} catch (error) {
			onError(error, item, index);
		}
	}

	return false;
};
