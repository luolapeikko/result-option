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
	 * @returns {ReturnType | undefined} value or undefined
	 */
	ok(): ReturnType | undefined;
	/**
	 * Check that result is not an error
	 * @returns {boolean} true if result is not an error
	 */
	isOk(): boolean;
	/**
	 * Try to get the error, otherwise return undefined
	 * @returns {ErrorType | undefined} error or undefined
	 */
	err(): ErrorType | undefined;
	/**
	 * Check that result is an error
	 * @returns {boolean} true if result is an error
	 */
	isErr(): boolean;
	/**
	 * Unwrap the value, if it is an error, throws the error
	 * @returns {ReturnType} returns the value
	 * @throws {ErrorType} throws the error if the result is an error
	 */
	unwrap(): ReturnType;
	/**
	 * Unwrap the value, if it is an error, return the default value
	 * @param {ReturnType} value default value to return if the result is an error
	 * @returns {ReturnType} returns the value or the default value
	 */
	unwrapOrDefault(value: ReturnType): ReturnType;
}

/**
 * Utility type for ReturnType or IResult
 * @template ReturnType Type of the return value
 * @template ErrorType Type of the error, default is unknown
 */
export type ResultOrReturnType<ReturnType, ErrorType> = ReturnType | IResult<ReturnType, ErrorType>;

/**
 * Type guard for IResult interface
 * @template ReturnType Type of the return value
 * @template ErrorType Type of the error, default is unknown
 * @param {unknown} value unknown value
 * @returns {boolean} true if value is IResult
 */
export function isResult<ReturnType, ErrorType = unknown>(value: unknown): value is IResult<ReturnType, ErrorType> {
	return value instanceof AbstractResult;
}
