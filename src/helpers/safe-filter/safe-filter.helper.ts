import type { OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to safely filter a collection without worrying about runtime errors.
 *
 * If an error occurs during predicate evaluation, the item is skipped.
 */
export const safeFilter = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): Array<TInput> => {
	const { onError = () => {} } = options;

	const results: Array<TInput> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (matches) {
				results.push(item);
			}
		} catch (error) {
			onError(error, item, index);
		}
	}

	return results;
};
