import type { OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to safely check if all elements in an array satisfy a predicate function.
 *
 * Similar to Array.prototype.every(), but with error handling:
 * - If the predicate throws an error for any element, returns false
 * - Allows custom error handling via onError callback
 */
export const safeEvery = <TInput>(
	collection: Array<TInput>,
	predicate: Predicate<TInput>,
	options: {
		onError?: OnError<TInput>;
	} = {}
): boolean => {
	const { onError = () => {} } = options;

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (!matches) {
				return false;
			}
		} catch (error) {
			onError(error, item, index);

			return false;
		}
	}

	return true;
};
