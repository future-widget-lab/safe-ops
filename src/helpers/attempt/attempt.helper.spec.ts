import { attempt } from './attempt.helper';

describe('Unit | Helper | safeguard', () => {
	it.each([
		{
			input: () => {
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
	])('should return $expected given $input', ({ input, expected }) => {
		expect(attempt(input)).toEqual(expected);
	});
});
