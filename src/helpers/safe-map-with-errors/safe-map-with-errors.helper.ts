import type { ErrorReport, OnError } from '../../types/errors.type';

/**
 * @description
 * Use this helper to safely transform a collection while capturing both successful results and errors.
 *
 * This ensures you have full visibility into what went wrong during transformation.
 */
export const safeMapWithErrors = <TInput, TOutput>(
	collection: Array<TInput>,
	transformer: (item: TInput, index: number, array: Array<TInput>) => TOutput,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { results: Array<TOutput>; errors: Array<{ error: unknown; item: TInput; index: number }> } => {
	const { onError } = options;

	const results: Array<TOutput> = [];
	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			results.push(transformer(item, index, collection));
		} catch (error) {
			errors.push({ error: error as Error, item, index });

			onError?.(error, item, index);
		}
	}

	return { results, errors };
};
