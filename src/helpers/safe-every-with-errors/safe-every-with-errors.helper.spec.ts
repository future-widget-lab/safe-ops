import { safeEveryWithErrors } from './safe-every-with-errors.helper';

describe('Unit | Helper | safeEveryWithErrors', () => {
	it.each([
		{
			input: {
				collection: [2, 4, 6, 8],
				predicate: (x: number) => x % 2 === 0
			},
			expected: { result: true, errors: [] }
		},
		{
			input: {
				collection: [2, 4, 7, 8],
				predicate: (x: number) => x % 2 === 0
			},
			expected: { result: false, errors: [] }
		},
		{
			input: {
				collection: ['apple', 'apricot', 'avocado'],
				predicate: (word: string) => word.startsWith('a')
			},
			expected: { result: true, errors: [] }
		},
		{
			input: {
				collection: ['apple', 'banana', 'avocado'],
				predicate: (word: string) => word.startsWith('a')
			},
			expected: { result: false, errors: [] }
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
			expected: { result: false, errors: [{ error: new Error('Error at 20'), item: 20, index: 1 }] }
		},
		{
			input: {
				collection: [1, 2, 3],
				predicate: () => {
					throw new Error('Always fails');
				}
			},
			expected: { result: false, errors: [{ error: new Error('Always fails'), item: 1, index: 0 }] }
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, predicate } = input;

		expect(safeEveryWithErrors(collection as any, predicate as any)).toEqual(expected);
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

		const result = safeEveryWithErrors(collection, predicate, { onError });

		expect(result).toEqual({ result: false, errors: [{ error: new Error('Test error'), item: 10, index: 1 }] });
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 10, 1);
	});
});
