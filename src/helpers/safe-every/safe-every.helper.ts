import type { OnError } from '../../types/errors.type';
import type { Predicate } from '../../types/find.type';

/**
 * @description
 * Use this helper to safely check if every item in a collection satisfies a condition.
 *
 * If an error occurs during predicate evaluation, it is caught and `false` is returned.
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
