/* eslint-disable @typescript-eslint/no-explicit-any */
import {isResult, Result, ResultOrReturnType} from './Result';
import {Err} from './Err';
import {Ok} from './Ok';

/**
 * build safe wrapper for async callback function
 * @template TArgs function arguments
 * @template ReturnType return type
 * @template ErrorType error type
 * @param func async Promise or callback function
 * @returns PromiseResult
 * @example
 * const safeAsyncFunc = safeAsyncResultBuilder(async (arg1: string, arg2: number) => {
 * 	if (arg1 === 'error') {
 * 		throw new Error('oops');
 * 	}
 * 	return Promise.resolve('hello ${arg1} number: ${arg2}'}');
 * });
 *
 * // wrap fs/promises function to Promised Result
 * const writeFile = safeAsyncResultBuilder(fs.promises.writeFile);
 * const result = await writeFile('test.txt', 'hello world');
 * if (result.isOk) {
 *   console.log('file written');
 * } else {
 *   console.log('error writing file', result.err());
 * }
 */
export function safeAsyncResultBuilder<TArgs extends any[], ReturnType, ErrorType = unknown>(
	func: (...args: TArgs) => Promise<ResultOrReturnType<ReturnType, ErrorType>>,
) {
	return async (...args: TArgs): Promise<Result<ReturnType, ErrorType>> => {
		try {
			const data = await func(...args);
			// if data is already a Result, return it directly
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
 * safe	wrapper for async Promise
 * @param func async Promise or callback function
 * @template ReturnType return type
 * @template ErrorType error type
 * @returns Result Promise
 * @example
 * const data = await safeAsyncResult<unknown, SyntaxError>(res.json());
 */
export async function safeAsyncResult<ReturnType, ErrorType = unknown>(
	func: Promise<ResultOrReturnType<ReturnType, ErrorType>> | (() => Promise<ResultOrReturnType<ReturnType, ErrorType>>),
): Promise<Result<ReturnType, ErrorType>> {
	try {
		const data = await (typeof func === 'function' ? func() : func);
		// if data is already a Result, return it directly
		if (isResult(data)) {
			return data;
		}
		return Ok<ReturnType, ErrorType>(data);
	} catch (err) {
		return Err<ReturnType, ErrorType>(err as ErrorType);
	}
}
