import { attemptAsync } from './attempt-async.helper';

describe('Unit | Helper | attemptAsync', () => {
	it.each([
		{
			input: async () => {
				return 5;
			},
			expected: { ok: true, error: null, result: 5 }
		},
		{
			input: () => {
				throw new Error('Test');
			},
			expected: { ok: false, error: expect.any(Error), result: null }
		}
	])('should return $expected given $input', async ({ input, expected }) => {
		expect(await attemptAsync(input)).toEqual(expected);
	});
});
