/* eslint-disable @typescript-eslint/no-explicit-any */
import {type Result, type ResultOrOkType} from './Result.js';
import {Err} from './Err.js';
import {Ok} from './Ok.js';

/**
 * build safe wrapper for async callback function
 * @template TArgs function arguments
 * @template OkType return type
 * @template ErrType error type
 * @param func async Promise or callback function
 * @returns PromiseResult
 * @example
 * const safeAsyncFunc = safeAsyncResultBuilder(async (arg1: string, arg2: number) => {
 * 	if (arg1 === 'error') {
 * 		throw new Error('oops');
 * 	}
 * 	return Promise.resolve(`hello ${arg1} number: ${arg2}`);
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
export function safeAsyncResultBuilder<TArgs extends any[], OkType = unknown, ErrType = unknown>(
	func: (...args: TArgs) => Promise<ResultOrOkType<OkType, ErrType>>,
) {
	return async (...args: TArgs): Promise<Result<OkType, ErrType>> => {
		try {
			return Ok<OkType, ErrType>(await func(...args));
		} catch (err) {
			return Err<OkType, ErrType>(err as ErrType);
		}
	};
}

/**
 * safe	wrapper for async Promise
 * @param func async Promise or callback function
 * @template OkType return type
 * @template ErrType error type
 * @returns Result Promise
 * @example
 * const data = await safeAsyncResult<unknown, SyntaxError>(res.json());
 */
export async function safeAsyncResult<OkType = unknown, ErrType = unknown>(
	func: Promise<ResultOrOkType<OkType, ErrType>> | (() => Promise<ResultOrOkType<OkType, ErrType>>),
): Promise<Result<OkType, ErrType>> {
	try {
		return Ok<OkType, ErrType>(await (typeof func === 'function' ? func() : func));
	} catch (err) {
		return Err<OkType, ErrType>(err as ErrType);
	}
}
