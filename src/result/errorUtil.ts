function supportsErrorCause() {
	try {
		const original = new Error('Original error');
		const err = new Error('New error', {cause: original});
		return err.cause === original;
	} catch (_err) {
		return false;
	}
}

let isCauseSupported: boolean | undefined;

export function isErrorCauseSupported() {
	isCauseSupported ??= supportsErrorCause();
	return isCauseSupported;
}
