import { safeForEachWithErrors } from './safe-for-each-with-errors.helper';

describe('Unit | Helper | safeForEachWithErrors', () => {
	it.each([
		{
			input: {
				collection: [1, 2, 3],
				callback: jest.fn()
			},
			expectedErrors: []
		},
		{
			input: {
				collection: [1, null, 3],
				callback: jest.fn().mockImplementation((x: number | null) => {
					if (x === null) {
						throw new Error('Invalid item');
					}
				})
			},
			expectedErrors: [{ index: 1, item: null, error: expect.any(Error) }]
		}
	])('should call callback for each item in $input.collection and return errors', ({ input, expectedErrors }) => {
		const { collection, callback } = input;

		const result = safeForEachWithErrors(collection as any, callback as any);

		expect(callback).toHaveBeenCalledTimes(collection.length);
		expect(result.errors).toEqual(expectedErrors);
	});

	it('should call onError when an error occurs', () => {
		const collection = [1, null, 3];

		const callback = jest.fn().mockImplementation((x: number | null) => {
			if (x === null) {
				throw new Error('Invalid item');
			}
		});

		const onError = jest.fn();

		const result = safeForEachWithErrors(collection, callback, { onError });

		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error), null, 1);
		expect(result.errors).toEqual([{ index: 1, item: null, error: expect.any(Error) }]);
	});
});
