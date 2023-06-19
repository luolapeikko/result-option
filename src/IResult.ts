import {AbstractResult} from './AbstractResult';

/**
 * IResult interface
 * @interface IResult
 * @template ReturnType Type of the return value
 * @template ErrorType Type of the error, default is unknown
 * @property {ok} ok method to try to get value, otherwise return undefined
 * @property {isOk} isOk method to check that result is not an error
 * @property {err} err method to try to get the error, otherwise return undefined
 * @property {isErr} isErr method to check that result is an error
 * @property {unwrap} unwrap  method to unwrap the value, if it is an error, throws the error
 * @property {unwrapOrDefault} unwrapOrDefault method to unwrap the value, if it is an error, return the default value
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

export type ResultOrReturnType<ReturnType, ErrorType> = ReturnType | IResult<ReturnType, ErrorType>;

/**
 * Type guard for IResult
 * @param {unknown} value unknown value
 * @returns {boolean}
 */
export function isResult<ReturnType, ErrorType = unknown>(value: unknown): value is IResult<ReturnType, ErrorType> {
	return value instanceof AbstractResult;
}

/**
 * IResult interface methods
 */

/**
 * __Ok()__ method to try to get value, otherwise return undefined
 * @callback ok
 * @returns {ReturnType | undefined}
 * @example
 * const result: IResult = new Ok(1);
 * result.ok(); // 1
 */

/**
 * __isOk()__ method to check that result is not an error
 * @callback isOk
 * @returns {boolean}
 * @example
 * const result: IResult = new Ok(1);
 * result.isOk(); // true
 */

/**
 * __err()__ method to try to get the error, otherwise return undefined
 * @callback err
 * @returns {ErrorType | undefined}
 * @example
 * const result: IResult = new Err(new Error('error'));
 * result.err(); // Error('error')
 */

/**
 * __isErr()__ method to check that result is an error
 * @callback isErr
 * @returns {boolean}
 * @example
 * const result: IResult = new Err(new Error('error'));
 * result.isErr(); // true
 */

/**
 * __unwrap()__ method to unwrap the value, if it is an error, throws the error
 * @callback unwrap
 * @returns {ReturnType}
 * @throws {ErrorType}
 * @example
 * const result: IResult = new Ok(1);
 * result.unwrap(); // 1
 */

/**
 * __unwrapOrDefault()__ method to unwrap the value, if it is an error, return the default value
 * @callback unwrapOrDefault
 * @param {ReturnType} value default value
 * @returns {ReturnType}
 * @example
 * const result: IResult = new Err(new Error('error'));
 * result.unwrapOrDefault(1); // 1
 */
