/* eslint-disable @typescript-eslint/no-explicit-any */
import {isResult, Result, ResultOrReturnType} from './Result';
import {Err} from './Err';
import {Ok} from './Ok';

/**
 * build safe wrapper for callback function
 * @template TArgs function arguments
 * @template ReturnType return type
 * @template ErrorType error type
 * @param func callback function
 * @returns Result
 * @example
 * const existsSync = safeResultBuilder(fs.existsSync);
 * const result: Result<boolean> = existsSync('test.txt');
 */
export function safeResultBuilder<TArgs extends any[], ReturnType, ErrorType = unknown>(func: (...args: TArgs) => ResultOrReturnType<ReturnType, ErrorType>) {
	return (...args: TArgs): Result<ReturnType, ErrorType> => {
		try {
			const data = func(...args);
			// if data is already a Result, return it
			if (isResult(data)) {
				return data;
			}
			return Ok<ReturnType, ErrorType>(data);
		} catch (err) {
			return Err<ReturnType, ErrorType>(err as ErrorType);
		}
	};
}

/**
 * safe wrapper for function
 * @param func
 * @template ReturnType return type
 * @template ErrorType error type
 * @returns Result
 * @example
 * function test(): number {
 * 	 throw new Error('asd');
 * }
 * const value: Result<number> = safeResult(test);
 */
export function safeResult<ReturnType, ErrorType = unknown>(func: () => ResultOrReturnType<ReturnType, ErrorType>): Result<ReturnType, ErrorType> {
	try {
		const data = func();
		// if data is already a Result, return it
		if (isResult(data)) {
			return data;
		}
		return Ok<ReturnType, ErrorType>(data);
	} catch (err) {
		return Err<ReturnType, ErrorType>(err as ErrorType);
	}
}
