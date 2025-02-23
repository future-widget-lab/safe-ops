import { safeFilterWithErrors } from './safe-filter-with-errors.helper';

describe('Unit | Helper | safeFilterWithErrors', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3, 4, 5],
				predicate: (x: number) => x % 2 === 0
			},
			expected: { results: [2, 4], errors: [] }
		},
		{
			input: {
				collection: ['apple', 'banana', 'cherry'],
				predicate: (word: string) => word.includes('a')
			},
			expected: { results: ['apple', 'banana'], errors: [] }
		},
		{
			input: {
				collection: [1, null, 3, 4],
				predicate: (x: number | null) => {
					if (x === null) {
						throw new Error('Invalid item');
					}

					return x > 2;
				}
			},
			expected: {
				results: [3, 4],
				errors: [{ error: new Error('Invalid item'), item: null, index: 1 }]
			}
		},
		{
			input: {
				collection: [10, 20, 30, 40],
				predicate: (num: number) => {
					if (num === 20) {
						throw new Error('Error at 20');
					}

					return num > 15;
				}
			},
			expected: {
				results: [30, 40],
				errors: [{ error: new Error('Error at 20'), item: 20, index: 1 }]
			}
		},
		{
			input: {
				collection: ['x', 'y', 'z'],
				predicate: () => {
					throw new Error('Always fails');
				}
			},
			expected: {
				results: [],
				errors: [
					{ error: new Error('Always fails'), item: 'x', index: 0 },
					{ error: new Error('Always fails'), item: 'y', index: 1 },
					{ error: new Error('Always fails'), item: 'z', index: 2 }
				]
			}
		}
	])('should return $expected.results given $input.collection and collect errors', ({ input, expected }) => {
		const { collection, predicate } = input;

		const result = safeFilterWithErrors(collection as any, predicate as any);

		expect(result.results).toEqual(expected.results);
		expect(result.errors).toEqual(
			expected.errors.map(({ error, item, index }) => ({
				error: expect.objectContaining({ message: error.message }),
				item,
				index
			}))
		);
	});

	it('should call onError when an error occurs', () => {
		const collection = [1, 2, 3, 4];
		const onError = jest.fn();

		const predicate = (num: number) => {
			if (num === 2) {
				throw new Error('Test error');
			}
			return num > 2;
		};

		const result = safeFilterWithErrors(collection, predicate, { onError });

		expect(result.results).toEqual([3, 4]);
		expect(result.errors).toEqual([
			{
				error: expect.objectContaining({ message: 'Test error' }),
				item: 2,
				index: 1
			}
		]);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Test error' }), 2, 1);
	});
});
