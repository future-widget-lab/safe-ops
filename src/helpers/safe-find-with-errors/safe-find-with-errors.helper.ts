import type { ErrorReport, OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to return the value of the first element in the array where predicate is true, and undefined.
 *
 * This function behaves similarly to `Array.prototype.find`, but with added error handling:
 * - If the predicate throws an error for any element, the error is handled via the onError callback.
 * - Collects errors in an array and returns it in the report.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to search.
 * @param {Predicate<TInput>} predicate A function that tests each element of the array. Called once for each item in the array.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 *
 * @returns {{ found: TInput | undefined; errors: Array<ErrorReport<TInput>> }} A report which contains the value of the first element in the array where predicate is true (and undefined if no such element is found) and the errors that occurred.
 */
export const safeFindWithErrors = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { found: TInput | undefined; errors: Array<ErrorReport<TInput>> } => {
	const { onError } = options;

	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (matches) {
				return { found: item, errors };
			}
		} catch (error) {
			errors.push({ error: error as Error, item, index });

			onError?.(error, item, index);
		}
	}

	return { found: undefined, errors };
};
