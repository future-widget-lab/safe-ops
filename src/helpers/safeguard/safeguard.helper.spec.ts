import { safeguard } from './safeguard.helper';

describe('Unit | Helper | safeguard', () => {
	it.each([
		{ input: false, expected: false },
		{ input: undefined, expected: false },
		{ input: null, expected: false },
		{ input: '', expected: false },
		{ input: 0, expected: false },
		{ input: 1, expected: true },
		{ input: new Date(), expected: true },
		{ input: [], expected: true },
		{ input: {}, expected: true },
		{ input: () => {}, expected: true }
	])('should return $expected given $input', ({ input, expected }) => {
		expect(safeguard(input)).toEqual(expected);
	});
});
