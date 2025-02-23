import { safeFilter } from './safe-filter.helper';

describe('Unit | Helper | safeFilter', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3, 4, 5],
				predicate: (x: number) => x % 2 === 0
			},
			expected: [2, 4]
		},
		{
			input: {
				collection: ['apple', 'banana', 'cherry'],
				predicate: (word: string) => word.includes('a')
			},
			expected: ['apple', 'banana']
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
			expected: [3, 4]
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
			expected: [30, 40]
		},
		{
			input: {
				collection: ['x', 'y', 'z'],
				predicate: () => {
					throw new Error('Always fails');
				}
			},
			expected: []
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, predicate } = input;

		expect(safeFilter(collection as any, predicate as any)).toEqual(expected);
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

		const result = safeFilter(collection, predicate, { onError });

		expect(result).toEqual([3, 4]);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 2, 1);
	});
});
