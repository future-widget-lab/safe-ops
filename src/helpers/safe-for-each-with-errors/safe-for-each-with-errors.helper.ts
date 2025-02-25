import type { ErrorReport, OnError } from '../../types/errors.type';
import type { ForEachCallback } from '../../types/for-each.type';

/**
 * @description
 * Use this helper to execute a function for each element in an array.
 *
 * This function behaves similarly to `Array.prototype.forEach`, but with added error handling:
 * - If the callback throws an error for any element, the error is handled via the onError callback.
 * - Collects errors in an array and returns it in the report.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array of items to iterate over.
 * @param {ForEachCallback<TInput>} callback The function to execute for each element.
 * @param {{ onError?: OnError<TInput> }} options An optional object for error handling.
 */
export const safeForEachWithErrors = <TInput>(
	collection: Array<TInput>,
	callback: ForEachCallback<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { errors: Array<ErrorReport<TInput>> } => {
	const { onError } = options;

	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			callback(item, index, collection);
		} catch (error) {
			errors.push({ error: error as Error, item, index });

			onError?.(error, item, index);
		}
	}

	return { errors };
};
