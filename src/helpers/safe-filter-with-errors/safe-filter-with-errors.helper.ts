import type { ErrorReport, OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to return the elements of an array that meet the condition specified in a callback function.
 *
 * This function behaves similarly to `Array.prototype.filter`, but with added error handling:
 * - If the predicate throws an error for any element, the error is handled via the onError callback.
 * - Collects errors in an array and returns it in the report.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to filter.
 * @param {Predicate<TInput>} predicate A function that tests each element of the array. Called once for each item in the array.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 *
 * @returns {{ results: Array<TInput>; errors: Array<ErrorReport<TInput>> }} A report which contains the array of items that match the predicate and the errors that occurred.
 */
export const safeFilterWithErrors = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { results: Array<TInput>; errors: Array<ErrorReport<TInput>> } => {
	const { onError = () => {} } = options;

	const results: Array<TInput> = [];
	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (matches) {
				results.push(item);
			}
		} catch (error) {
			errors.push({ error: error as Error, item, index });
			onError(error, item, index);
		}
	}

	return { results, errors };
};
