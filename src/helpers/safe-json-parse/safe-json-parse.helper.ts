/**
 * @description
 * Use this helper to safely parse a possibly faulty JSON object.
 */
export const safeJsonParse = <TData>(input: string | null | undefined, fallback: TData): TData => {
	try {
		return !!input ? JSON.parse(input) : fallback;
	} catch {
		return fallback;
	}
};
