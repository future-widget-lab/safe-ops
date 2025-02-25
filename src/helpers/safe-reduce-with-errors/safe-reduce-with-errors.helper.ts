import type { ErrorReport, OnError } from '../../types/errors.type';
import type { Reducer } from '../../types/reduce.type';

/**
 * @description
 * Use this helper to create an accumulated result given an array and an initial value.
 * - If the reducer throws an error for any element, the error is handled via the onError callback.
 * - Collects errors in an array and returns it in the report.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array to reduce.
 * @param {Reducer<TInput, TOutput>} reducer A function that processes each element.
 * @param {TOutput} initialValue The initial value for the accumulator.
 * @param {{ onError?: OnError<TInput> }} options Optional error handling configuration.
 *
 * @returns {{ result: TOutput; errors: Array<ErrorReport<TInput>> }} An object containing the final result and any errors encountered.
 */
export const safeReduceWithErrors = <TInput, TOutput>(
	collection: Array<TInput>,
	reducer: Reducer<TInput, TOutput>,
	initialValue: TOutput,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { result: TOutput; errors: Array<ErrorReport<TInput>> } => {
	const { onError = () => {} } = options;

	let accumulator = initialValue;
	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			accumulator = reducer(accumulator, item, index, collection);
		} catch (error) {
			errors.push({ error: error as Error, item, index });

			onError(error, item, index);
		}
	}

	return { result: accumulator, errors };
};
