import { safeFindIndex } from './safe-find-index.helper';

describe('Unit | Helper | safeFindIndex', () => {
	it.each([
		{
			input: {
				collection: [1, 3, 5, 7],
				predicate: (x: number) => x % 2 === 0
			},
			expected: -1
		},
		{
			input: {
				collection: [1, 3, 4, 7],
				predicate: (x: number) => x % 2 === 0
			},
			expected: 2
		},
		{
			input: {
				collection: ['banana', 'peach', 'avocado'],
				predicate: (word: string) => word.startsWith('a')
			},
			expected: 2
		},
		{
			input: {
				collection: ['banana', 'peach', 'mango'],
				predicate: (word: string) => word.startsWith('a')
			},
			expected: -1
		},
		{
			input: {
				collection: [5, 10, 15],
				predicate: (num: number) => {
					if (num === 10) {
						throw new Error('Error at 10');
					}
					return num > 10;
				}
			},
			expected: 2
		},
		{
			input: {
				collection: [5, 15, 25],
				predicate: (num: number) => {
					if (num === 15) {
						throw new Error('Error at 15');
					}
					return num > 20;
				}
			},
			expected: 2
		},
		{
			input: {
				collection: [1, 2, 3],
				predicate: () => {
					throw new Error('Always fails');
				}
			},
			expected: -1
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, predicate } = input;

		expect(safeFindIndex(collection as any, predicate as any)).toEqual(expected);
	});

	it('should call onError when an error occurs', () => {
		const collection = [5, 10, 15];
		const onError = jest.fn();

		const predicate = (num: number) => {
			if (num === 10) {
				throw new Error('Test error');
			}
			return num > 5;
		};

		const result = safeFindIndex(collection, predicate, { onError });

		expect(result).toBe(2);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 10, 1);
	});
});
