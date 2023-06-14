export interface ISyncResult<ReturnType, ErrorType = unknown> {
	/**
	 * try to get value, otherwise return undefined
	 */
	ok(): ReturnType | undefined;
	/**
	 * Check that result is not an error
	 */
	isOk(): boolean;
	/**
	 * try to get the error, otherwise return undefined
	 */
	err(): ErrorType | undefined;
	/**
	 * Check that result is an error
	 */
	isErr(): boolean;
	/**
	 * Unwrap the value, if it is an error, throws the error
	 */
	unwrap(): ReturnType;
	/**
	 * Unwrap the value, if it is an error, return the default value
	 */
	unwrapOrDefault(value: ReturnType): ReturnType;
}
