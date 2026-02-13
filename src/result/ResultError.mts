export function isErr(err: unknown): err is Error {
	/* v8 ignore start */
	if ('isError' in Error && typeof Error.isError === 'function') {
		return Error.isError(err);
	}
	// fallback for environments that don't support Error.isError
	return err instanceof Error;
	/* v8 ignore stop */
}

function getMsg(err: unknown): string {
	if (isErr(err)) {
		return err.message;
	}
	if (typeof err === 'string') {
		return err;
	}
	return `Unknown error: ${JSON.stringify(err)}`;
}

/**
 * Wrap Error class for Result (use cause to keep original stack trace)
 */
export class ResultError extends Error {
	public constructor(cause: unknown) {
		super(getMsg(cause), {cause});
	}
}
