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
		onError?: (error: unknown, item: TInput, index: number) => void;
	} = {}
): { results: Array<TOutput>; errors: Array<{ error: unknown; item: TInput; index: number }> } => {
	const { onError } = options;

	const results: Array<TOutput> = [];
	const errors: Array<{ error: unknown; item: TInput; index: number }> = [];

	collection.forEach((item, index, array) => {
		try {
			results.push(transformer(item, index, array));
		} catch (error) {
			errors.push({ error, item, index });

			onError?.(error, item, index);
		}
	});

	return { results, errors };
};
