import type { OnError } from '../../types/errors.type';
import type { Reducer } from '../../types/reduce.type';

/**
 * @description
 * Use this helper to create an accumulated result given an array and an initial value.
 * - If the reducer throws an error for any element, the error is handled via the onError callback.
 * - Allows for custom error handling through the onError option.
 *
 * @param {Array<TInput>} collection The array to reduce.
 * @param {Reducer<TInput, TOutput>} reducer A function that processes each element.
 * @param {TOutput} initialValue The initial value for the accumulator.
 * @param {{ onError?: OnError<TInput> }} options Optional error handling configuration.
 *
 * @returns {TOutput} The accumulated result.
 */
export const safeReduce = <TInput, TOutput>(
	collection: Array<TInput>,
	reducer: Reducer<TInput, TOutput>,
	initialValue: TOutput,
	options: {
		onError?: OnError<TInput>;
	} = {}
): TOutput => {
	const { onError = () => {} } = options;

	let accumulator = initialValue;

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			accumulator = reducer(accumulator, item, index, collection);
		} catch (error) {
			onError(error, item, index);
		}
	}

	return accumulator;
};
