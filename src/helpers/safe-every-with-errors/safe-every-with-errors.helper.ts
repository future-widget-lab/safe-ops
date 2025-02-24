import type { ErrorReport, OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to safely check if all elements in an array satisfy a predicate function.
 *
 * Similar to Array.prototype.every(), but with error handling:
 * - If the predicate throws an error for any element, returns false
 * - Collects any errors that occur during execution
 * - Allows custom error handling via onError callback
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
