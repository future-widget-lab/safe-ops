import { safeForEach } from './safe-for-each.helper';

describe('Unit | Helper | safeForEach', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3],
				callback: jest.fn().mockImplementation((x: number) => {
					return x * 2;
				})
			}
		},
		{
			input: {
				collection: [1, null, 3],
				callback: jest.fn().mockImplementation((x: number | null) => {
					if (x === null) {
						throw new Error('Invalid item');
					}

					return x * 2;
				})
			},
			expected: [2, 6]
		}
	])('should return $expected given $input.collection', ({ input }) => {
		const { collection, callback } = input;

		safeForEach(collection as any, callback as any);

		expect(callback).toHaveBeenCalledTimes(3);
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

		safeForEach(collection, transformer, { onError });

		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), null, 1);
	});
});
