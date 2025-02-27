import { safeJsonParse } from './safe-json-parse.helper';

describe('Unit | Helper | safeJsonParse', () => {
	it.each([
		{
			input: [`{ "valid": true }`, {}],
			expected: { valid: true }
		},
		{
			input: [`invalid json`, { userId: 1 }],
			expected: { userId: 1 }
		}
	])('should return $expected given $input', ({ input, expected }) => {
		expect(safeJsonParse(input[0] as string, input[1])).toEqual(expected);
	});
});
