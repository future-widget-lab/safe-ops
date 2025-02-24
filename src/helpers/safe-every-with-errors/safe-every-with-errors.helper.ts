import type { ErrorReport, OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper determine whether all the members of an array satisfy the specified test.
 *
 * This function behaves similarly to `Array.prototype.every`, but with added error handling:
 * - If the predicate throws an error for any element, the error is handled via the onError callback.
 * - Collects errors in an array and returns it in the report.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to test.
 * @param {Predicate<TInput>} predicate A function that tests each element of the array. Called once for each item in the array.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 *
 * @returns {{ result: boolean; errors: Array<ErrorReport<TInput>> }} A report which contains the result of the test and the errors that occurred.
 */
export const safeEveryWithErrors = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { result: boolean; errors: Array<ErrorReport<TInput>> } => {
	const { onError = () => {} } = options;
	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (!matches) {
				return { result: false, errors };
			}
		} catch (error) {
			errors.push({ error: error as Error, item, index });

			onError(error, item, index);

			return { result: false, errors };
		}
	}

	return { result: true, errors };
};
