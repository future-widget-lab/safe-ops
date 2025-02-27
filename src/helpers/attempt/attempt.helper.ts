/**
 * @description
 * Use this helper to safely invoke a function and catch any errors that occur.
 */
export const attempt = <TData, TError = Error>(fn: () => TData) => {
	try {
		return { ok: true, result: fn(), error: null };
	} catch (error) {
		return { ok: false, result: null, error: error as TError };
	}
};
