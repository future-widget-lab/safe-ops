import { safeFind } from './safe-find.helper';

describe('Unit | Helper | safeFind', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3, 4, 5],
				predicate: (x: number) => {
					return x === 3;
				}
			},
			expected: 3
		},
		{
			input: {
				collection: ['apple', 'banana', 'cherry'],
				predicate: (x: string) => {
					return x.startsWith('b');
				}
			},
			expected: 'banana'
		},
		{
			input: {
				collection: [10, 20, 30, 40],
				predicate: (x: number) => {
					return x > 100;
				}
			},
			expected: undefined
		},
		{
			input: {
				collection: [{ id: 1 }, { id: 2 }, { id: 3 }],
				predicate: (item: { id: number }) => {
					return item.id === 2;
				}
			},
			expected: { id: 2 }
		},
		{
			input: {
				collection: [true, false, true, false],
				predicate: (x: boolean) => {
					return x === false;
				}
			},
			expected: false
		}
	])('should return $expected given $input.collection', ({ input, expected }) => {
		const { collection, predicate } = input;

		expect(safeFind(collection as any, predicate as any)).toEqual(expected);
	});

	it('should skip items that cause an error and continue searching', () => {
		const collection = [1, 2, 3, 4, 5];

		const predicate = (x: number) => {
			if (x === 2) {
				throw new Error('Test error');
			}

			return x === 3;
		};

		expect(safeFind(collection, predicate)).toEqual(3);
	});

	it('should call onError when an error occurs', () => {
		const collection = [1, 2, 3];

		const onError = jest.fn();

		const predicate = (x: number) => {
			if (x === 2) {
				throw new Error('Test error');
			}

			return false;
		};

		safeFind(collection, predicate, { onError });

		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 2, 1);
	});
});
