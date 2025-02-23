import { safeFindWithErrors } from './safe-find-with-errors.helper';

describe('Unit | Helper | safeFindWithErrors', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3, 4, 5],
				predicate: (x: number) => x > 3
			},
			expected: { found: 4, errors: [] }
		},
		{
			input: {
				collection: ['apple', 'banana', 'cherry'],
				predicate: (x: string) => x.startsWith('b')
			},
			expected: { found: 'banana', errors: [] }
		},
		{
			input: {
				collection: [10, 20, 30],
				predicate: (x: number) => {
					if (x === 20) {
						throw new Error('Error at 20');
					}
					return x === 30;
				}
			},
			expected: {
				found: 30,
				errors: [{ error: new Error('Error at 20'), item: 20, index: 1 }]
			}
		},
		{
			input: {
				collection: ['x', 'y', 'z'],
				predicate: (char: string) => {
					if (char === 'y') {
						throw new Error('Invalid character');
					}
					return char === 'w'; // No match
				}
			},
			expected: {
				found: undefined,
				errors: [{ error: new Error('Invalid character'), item: 'y', index: 1 }]
			}
		},
		{
			input: {
				collection: [0, 1, 2, 3],
				predicate: (num: number) => {
					if (num % 2 === 0) {
						throw new Error('Even number error');
					}
					return num === 5; // No match
				}
			},
			expected: {
				found: undefined,
				errors: [
					{ error: new Error('Even number error'), item: 0, index: 0 },
					{ error: new Error('Even number error'), item: 2, index: 2 }
				]
			}
		},
		{
			input: {
				collection: [1, 2, 3, 4],
				predicate: (num: number) => {
					if (num === 2) {
						throw new Error('Error at 2');
					}
					if (num === 4) {
						throw new Error('Error at 4');
					}
					return num === 3;
				}
			},
			expected: {
				found: 3,
				errors: [{ error: new Error('Error at 2'), item: 2, index: 1 }]
			}
		},
		{
			input: {
				collection: [5, 10, 15],
				predicate: () => {
					throw new Error('Always fails');
				}
			},
			expected: {
				found: undefined,
				errors: [
					{ error: new Error('Always fails'), item: 5, index: 0 },
					{ error: new Error('Always fails'), item: 10, index: 1 },
					{ error: new Error('Always fails'), item: 15, index: 2 }
				]
			}
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, predicate } = input;

		const result = safeFindWithErrors(collection as any, predicate as any);

		expect(result.found).toEqual(expected.found);
		expect(result.errors).toHaveLength(expected.errors.length);

		expected.errors.forEach((expectedError, index) => {
			expect(result.errors[index].error.message).toBe(expectedError.error.message);
			expect(result.errors[index].item).toBe(expectedError.item);
			expect(result.errors[index].index).toBe(expectedError.index);
		});
	});
});
