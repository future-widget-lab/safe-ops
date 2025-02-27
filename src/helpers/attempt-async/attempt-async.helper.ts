/**
 * @description
 * Use this helper to safely invoke an async function and catch any errors that occur.
 */
export const attemptAsync = async <TData, TError = Error>(fn: () => Promise<TData>) => {
	try {
		return { ok: true, result: await fn(), error: null };
	} catch (error) {
		return { ok: false, result: null, error: error as TError };
	}
};
