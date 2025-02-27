/**
 * @description
 * Use this helper to safeguard against falsey values.
 */
export const safeguard = <T>(x: T | false | undefined | null | '' | 0): x is T => {
	return !!x;
};
