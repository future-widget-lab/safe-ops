import { safeReduceWithErrors } from './safe-reduce-with-errors.helper';

describe('Unit | Helper | safeReduceWithErrors', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3, 4],
				reducer: (acc: number, num: number) => acc + num,
				initialValue: 0
			},
			expected: { result: 10, errors: [] }
		},
		{
			input: {
				collection: [2, 3, 4],
				reducer: (acc: number, num: number) => acc * num,
				initialValue: 1
			},
			expected: { result: 24, errors: [] }
		},
		{
			input: {
				collection: ['a', 'b', 'c'],
				reducer: (acc: string, char: string) => acc + char,
				initialValue: ''
			},
			expected: { result: 'abc', errors: [] }
		},
		{
			input: {
				collection: [],
				reducer: (acc: number, num: number) => acc + num,
				initialValue: 100
			},
			expected: { result: 100, errors: [] }
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
			expected: {
				result: 40,
				errors: [{ error: expect.any(Error), item: 20, index: 1 }]
			}
		},
		{
			input: {
				collection: [1, 2, 3],
				reducer: () => {
					throw new Error('Always fails');
				},
				initialValue: 0
			},
			expected: {
				result: 0,
				errors: [
					{ error: expect.any(Error), item: 1, index: 0 },
					{ error: expect.any(Error), item: 2, index: 1 },
					{ error: expect.any(Error), item: 3, index: 2 }
				]
			}
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, reducer, initialValue } = input;

		expect(safeReduceWithErrors(collection as any, reducer as any, initialValue)).toEqual(expected);
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

		const result = safeReduceWithErrors(collection, reducer, 0, { onError });

		expect(result.result).toBe(20);
		expect(result.errors).toEqual([{ error: expect.any(Error), item: 10, index: 1 }]);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 10, 1);
	});
});
