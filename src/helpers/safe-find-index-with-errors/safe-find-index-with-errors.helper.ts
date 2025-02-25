import type { ErrorReport, OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper return the index of the first element in the array where predicate is true, and -1 otherwise.
 *
 * This function behaves similarly to `Array.prototype.findIndex`, but with added error handling:
 * - If the predicate throws an error for any element, the error is handled via the onError callback.
 * - Collects errors in an array and returns it in the report.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to test.
 * @param {Predicate<TInput>} predicate A function that tests each element of the array. Called once for each item in the array.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 *
 * @returns {{ index: number; errors: Array<ErrorReport<TInput>> }} The found index or -1 if not found, along with collected errors.
 */
export const safeFindIndexWithErrors = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { index: number; errors: Array<ErrorReport<TInput>> } => {
	const { onError = () => {} } = options;
	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (matches) {
				return { index, errors };
			}
		} catch (error) {
			errors.push({ error: error as Error, item, index });

			onError(error, item, index);
		}
	}

	return { index: -1, errors };
};
