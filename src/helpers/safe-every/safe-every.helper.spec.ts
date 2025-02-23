import { safeEvery } from './safe-every.helper';

describe('Unit | Helper | safeEvery', () => {
	it.each([
		{
			input: {
				collection: [2, 4, 6, 8],
				predicate: (x: number) => x % 2 === 0
			},
			expected: true
		},
		{
			input: {
				collection: [2, 4, 7, 8],
				predicate: (x: number) => x % 2 === 0
			},
			expected: false
		},
		{
			input: {
				collection: ['apple', 'apricot', 'avocado'],
				predicate: (word: string) => word.startsWith('a')
			},
			expected: true
		},
		{
			input: {
				collection: ['apple', 'banana', 'avocado'],
				predicate: (word: string) => word.startsWith('a')
			},
			expected: false
		},
		{
			input: {
				collection: [10, 20, 30],
				predicate: (num: number) => {
					if (num === 20) {
						throw new Error('Error at 20');
					}
					return num > 5;
				}
			},
			expected: false
		},
		{
			input: {
				collection: [1, 2, 3],
				predicate: () => {
					throw new Error('Always fails');
				}
			},
			expected: false
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, predicate } = input;

		expect(safeEvery(collection as any, predicate as any)).toEqual(expected);
	});

	it('should call onError when an error occurs', () => {
		const collection = [5, 10, 15];
		const onError = jest.fn();

		const predicate = (num: number) => {
			if (num === 10) {
				throw new Error('Test error');
			}
			return num > 0;
		};

		const result = safeEvery(collection, predicate, { onError });

		expect(result).toBe(false);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 10, 1);
	});
});
