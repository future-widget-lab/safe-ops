import { safeForEach } from './safe-for-each.helper';

describe('Unit | Helper | safeForEach', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3],
				callback: jest.fn()
			}
		},
		{
			input: {
				collection: [1, null, 3],
				callback: jest.fn().mockImplementation((x: number | null) => {
					if (x === null) {
						throw new Error('Invalid item');
					}
				})
			}
		}
	])('should call callback for each item in $input.collection', ({ input }) => {
		const { collection, callback } = input;

		safeForEach(collection as any, callback as any);

		expect(callback).toHaveBeenCalledTimes(collection.length);
	});

	it('should call onError when an error occurs', () => {
		const collection = [1, null, 3];

		const callback = jest.fn().mockImplementation((x: number | null) => {
			if (x === null) {
				throw new Error('Invalid item');
			}
		});

		const onError = jest.fn();

		safeForEach(collection, callback, { onError });

		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), null, 1);
	});
});
