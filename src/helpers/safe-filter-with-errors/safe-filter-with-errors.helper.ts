import type { ErrorReport, OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to safely filter a collection while collecting errors.
 *
 * If an error occurs during predicate evaluation, it is collected.
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
