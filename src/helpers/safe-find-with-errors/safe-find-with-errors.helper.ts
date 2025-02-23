import type { ErrorReport, OnError } from '../../types/errors.type';

/**
 * @description
 * Use this helper to safely find an item in a collection while collecting errors.
 *
 * If an error occurs during predicate evaluation, it is collected.
 *
 * Only errors that occur prior obtaining the desired match are collected.
 */
export const safeFindWithErrors = <TInput>(
	collection: Array<TInput>,
	predicate: (item: TInput, index: number, array: Array<TInput>) => boolean,
	options: {
		onError?: OnError<TInput>;
	} = {}
): { found: TInput | undefined; errors: Array<ErrorReport<TInput>> } => {
	const { onError } = options;

	const errors: Array<ErrorReport<TInput>> = [];

	for (let index = 0; index < collection.length; index++) {
		const item = collection[index];

		try {
			const matches = predicate(item, index, collection);

			if (matches) {
				return { found: item, errors };
			}
		} catch (error) {
			errors.push({ error: error as Error, item, index });

			onError?.(error, item, index);
		}
	}

	return { found: undefined, errors };
};
