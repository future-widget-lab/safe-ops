import { safeFindIndexWithErrors } from './safe-find-index-with-errors.helper';

describe('Unit | Helper | safeFindIndexWithErrors', () => {
	it.each([
		{
			input: {
				collection: [1, 3, 5, 7],
				predicate: (x: number) => x % 2 === 0
			},
			expected: { index: -1, errors: [] }
		},
		{
			input: {
				collection: [1, 3, 4, 7],
				predicate: (x: number) => x % 2 === 0
			},
			expected: { index: 2, errors: [] }
		},
		{
			input: {
				collection: ['banana', 'peach', 'avocado'],
				predicate: (word: string) => word.startsWith('a')
			},
			expected: { index: 2, errors: [] }
		},
		{
			input: {
				collection: ['banana', 'peach', 'mango'],
				predicate: (word: string) => word.startsWith('a')
			},
			expected: { index: -1, errors: [] }
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
			expected: { index: 2, errors: [{ error: expect.any(Error), item: 10, index: 1 }] }
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
			expected: { index: 2, errors: [{ error: expect.any(Error), item: 15, index: 1 }] }
		},
		{
			input: {
				collection: [1, 2, 3],
				predicate: () => {
					throw new Error('Always fails');
				}
			},
			expected: {
				index: -1,
				errors: [
					{ error: expect.any(Error), item: 1, index: 0 },
					{ error: expect.any(Error), item: 2, index: 1 },
					{ error: expect.any(Error), item: 3, index: 2 }
				]
			}
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, predicate } = input;

		expect(safeFindIndexWithErrors(collection as any, predicate as any)).toEqual(expected);
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

		const result = safeFindIndexWithErrors(collection, predicate, { onError });

		expect(result.index).toBe(2);
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0]).toMatchObject({ error: expect.any(Error), item: 10, index: 1 });
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 10, 1);
	});
});
