import { safeMapWithErrors } from './safe-map-with-errors.helper';

describe('Unit | Helper | safeMapWithErrors', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3],
				transformer: (x: number) => {
					return x * 2;
				}
			},
			expected: { results: [2, 4, 6], errors: [] }
		},
		{
			input: {
				collection: [1, null, 3],
				transformer: (x: number | null) => {
					if (x === null) {
						throw new Error('Invalid item');
					}

					return x * 2;
				}
			},
			expected: {
				results: [2, 6],
				errors: [{ errorMessage: 'Invalid item', item: null, index: 1 }]
			}
		},
		{
			input: {
				collection: ['a', 'b', 'c'],
				transformer: (char: string) => {
					return char.toUpperCase();
				}
			},
			expected: { results: ['A', 'B', 'C'], errors: [] }
		},
		{
			input: {
				collection: [10, 20, 30],
				transformer: (num: number) => {
					if (num === 20) {
						throw new Error('Error at 20');
					}

					return num / 10;
				}
			},
			expected: {
				results: [1, 3],
				errors: [{ errorMessage: 'Error at 20', item: 20, index: 1 }]
			}
		},
		{
			input: {
				collection: [0, 1, 2, 3],
				transformer: (num: number) => {
					if (num % 2 === 0) {
						throw new Error('Even number error');
					}

					return num;
				}
			},
			expected: {
				results: [1, 3],
				errors: [
					{ errorMessage: 'Even number error', item: 0, index: 0 },
					{ errorMessage: 'Even number error', item: 2, index: 2 }
				]
			}
		}
	])('should return correct results and errors for given input.collection', ({ input, expected }) => {
		const { collection, transformer } = input;
		const { results, errors } = safeMapWithErrors(collection as any, transformer as any);

		expect(results).toEqual(expected.results);

		expect(errors.map(({ error, item, index }) => ({ errorMessage: (error as Error).message, item, index }))).toEqual(
			expected.errors
		);
	});

	it('should call onError callback when an error occurs', () => {
		const onErrorMock = jest.fn();
		const collection = [1, null, 3];

		safeMapWithErrors(
			collection,
			(x) => {
				if (x === null) {
					throw new Error('Invalid item');
				}

				return x * 2;
			},
			{ onError: onErrorMock }
		);

		expect(onErrorMock).toHaveBeenCalledWith(expect.any(Error), null, 1);
		expect(onErrorMock.mock.calls[0][0].message).toBe('Invalid item');
	});
});
