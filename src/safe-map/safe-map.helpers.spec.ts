import { safeMap } from './safe-map.helper';

describe('Unit | Helper | safeMap', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3],
				transformer: (x: number) => {
					return x * 2;
				}
			},
			expected: [2, 4, 6]
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
			expected: [2, 6]
		},
		{
			input: {
				collection: ['a', 'b', 'c'],
				transformer: (char: string) => {
					return char.toUpperCase();
				}
			},
			expected: ['A', 'B', 'C']
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
			expected: [1, 3]
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
			expected: [1, 3]
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, transformer } = input;
		expect(safeMap(collection as any, transformer as any)).toEqual(expected);
	});

	it('should call onError when an error occurs', () => {
		const collection = [1, null, 3];

		const transformer = (x: number | null) => {
			if (x === null) {
				throw new Error('Invalid item');
			}

			return x * 2;
		};

		const onError = jest.fn();

		const result = safeMap(collection, transformer, { onError });

		expect(result).toEqual([2, 6]);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), null, 1);
	});
});
