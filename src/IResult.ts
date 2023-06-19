import {AbstractResult} from './AbstractResult';

/**
 * IResult interface
 * @interface IResult
 * @template ReturnType Type of the return value
 * @template ErrorType Type of the error, default is unknown
 */
export interface IResult<ReturnType, ErrorType = unknown> {
	/**
	 * Try to get value, otherwise return undefined
	 */
	ok(): ReturnType | undefined;
	/**
	 * Check that result is not an error
	 */
	isOk(): boolean;
	/**
	 * Try to get the error, otherwise return undefined
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

/**
 * Utility type for ReturnType or IResult
 */
export type ResultOrReturnType<ReturnType, ErrorType> = ReturnType | IResult<ReturnType, ErrorType>;

/**
 * Type guard for IResult interface
 * @param {unknown} value unknown value
 * @returns {boolean} true if value is IResult
 */
export function isResult<ReturnType, ErrorType = unknown>(value: unknown): value is IResult<ReturnType, ErrorType> {
	return value instanceof AbstractResult;
}
