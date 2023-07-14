import {AbstractResult} from './AbstractResult';
import {ConstructorWithValueOf} from './ValueOf';

/**
 * Result interface
 * @interface Result
 * @template ReturnType Type of the return value
 * @template ErrorType Type of the error, default is unknown
 * @example
 * async function action(): Promise<Result<number>> {
 *   try {
 *     return Ok<number>(await getNumber());
 *   } catch (e) {
 *     return Err<number>(e);
 *   }
 * }
 * const result = await action();
 * if (result.isOk()) {
 *   console.log('Result: ' + result.unwrap());
 * } else {
 *   console.log('Error: ', result.err());
 * }
 */
export interface Result<ReturnType, ErrorType = unknown> {
	/**
	 * Try to get value, otherwise return undefined
	 * @returns {ReturnType | undefined} value or undefined
	 * @example
	 * Ok<number>(2).ok() // 2
	 * Err<number>(new Error('broken')).ok() // undefined
	 */
	ok(): ReturnType | undefined;
	/**
	 * Check that result is not an error
	 * @returns {boolean} true if result is not an error
	 * @example
	 * Ok<number>(2).isOk() // true
	 * Err<number>(new Error('broken')).isOk() // false
	 */
	isOk(): boolean;
	/**
	 * Try to get the error, otherwise return undefined
	 * @returns {ErrorType | undefined} error or undefined
	 * @example
	 * Ok<number>(2).err() // undefined
	 * Err<number>(new Error('broken')).err() // Error('broken')
	 */
	err(): ErrorType | undefined;
	/**
	 * Check that result is an error
	 * @returns {boolean} true if result is an error
	 * @example
	 * Ok<number>(2).isErr() // false
	 * Err<number>(new Error('broken')).isErr() // true
	 */
	isErr(): boolean;
	/**
	 * Unwrap the value, if it is an error, throws the error
	 * @param {ErrorType} err optional error to throw instead of the result error
	 * @returns {ReturnType} returns the value
	 * @throws {ErrorType} throws the error if the result is an error
	 * @example
	 * Ok<number>(2).unwrap() // 2
	 * Err<number>(new Error('broken')).unwrap() // throws Error('broken')
	 */
	unwrap(err?: (err: ErrorType) => Error): ReturnType;
	/**
	 * Unwrap the value, if it is an error, return the default value
	 * @param {ReturnType} value default value to return if the result is an error
	 * @returns {ReturnType} returns the value or the default value
	 * @example
	 * Ok<number>(2).unwrapOr(0) // 2
	 * Err<number>(new Error('broken')).unwrapOr(0) // 0
	 */
	unwrapOr(value: ReturnType): ReturnType;
	/**
	 * unwraps an option and if not a Ok value returns the result of the given function.
	 * @param fn function to call
	 * @returns {ReturnType} returns the value
	 * @example
	 * Ok<number>(2).unwrapOrElse(() => 0) // 2
	 * Err<number>(new Error('broken')).unwrapOrElse(() => 0) // 0
	 */
	unwrapOrElse(fn: () => ReturnType): ReturnType;
	/**
	 * unwraps an result and if not a Ok value returns the default value from the constructor.
	 * @param cons Constructor
	 * @returns {ReturnType} returns the value
	 * @example
	 * Ok<number>(2).unwrapOrValueOf(Number) // 2
	 * Err<number>(new Error('broken')).unwrapOrValueOf(Number) // 0
	 */
	unwrapOrValueOf(cons: ConstructorWithValueOf<ReturnType>): ReturnType;

	/**
	 * Solve the result with the given solver
	 * @template Output Type of the output
	 * @param solver solver to use
	 * @returns {Output} returns the output of the solver
	 * @example
	 * const res: Result<string, Error> = Ok<string, Error>('hello');
	 * const data: string = res.match({
	 *   Ok: (value) => `${value} world`,
	 *   Err: (err) => `${err.message} world`,
	 * });
	 */
	match<Output>(solver: {Ok: (value: ReturnType) => Output; Err: (err: ErrorType) => Output}): Output;
}

/**
 * Utility type for ReturnType or Result
 * @template ReturnType Type of the return value
 * @template ErrorType Type of the error, default is unknown
 */
export type ResultOrReturnType<ReturnType, ErrorType> = ReturnType | Result<ReturnType, ErrorType>;

/**
 * Type guard for Result interface
 * @template ReturnType Type of the return value
 * @template ErrorType Type of the error, default is unknown
 * @param {unknown} value unknown value
 * @returns {boolean} true if value is Result
 */
export function isResult<ReturnType, ErrorType = unknown>(value: unknown): value is Result<ReturnType, ErrorType> {
	return value instanceof AbstractResult;
}
