import { safeReduce } from './safe-reduce.helper';

describe('Unit | Helper | safeReduce', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3, 4],
				reducer: (acc: number, num: number) => acc + num,
				initialValue: 0
			},
			expected: 10
		},
		{
			input: {
				collection: [2, 3, 4],
				reducer: (acc: number, num: number) => acc * num,
				initialValue: 1
			},
			expected: 24
		},
		{
			input: {
				collection: ['a', 'b', 'c'],
				reducer: (acc: string, char: string) => acc + char,
				initialValue: ''
			},
			expected: 'abc'
		},
		{
			input: {
				collection: [],
				reducer: (acc: number, num: number) => acc + num,
				initialValue: 100
			},
			expected: 100
		},
		{
			input: {
				collection: [10, 20, 30],
				reducer: (acc: number, num: number) => {
					if (num === 20) {
						throw new Error('Error at 20');
					}
					return acc + num;
				},
				initialValue: 0
			},
			expected: 40
		},
		{
			input: {
				collection: [1, 2, 3],
				reducer: () => {
					throw new Error('Always fails');
				},
				initialValue: 0
			},
			expected: 0
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, reducer, initialValue } = input;

		expect(safeReduce(collection as any, reducer as any, initialValue)).toEqual(expected);
	});

	it('should call onError when an error occurs', () => {
		const collection = [5, 10, 15];
		const onError = jest.fn();

		const reducer = (acc: number, num: number) => {
			if (num === 10) {
				throw new Error('Test error');
			}
			return acc + num;
		};

		const result = safeReduce(collection, reducer, 0, { onError });

		expect(result).toBe(20);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 10, 1);
	});
});
