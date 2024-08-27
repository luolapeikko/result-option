/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {type Result, type ResultOrOkType} from './Result.js';
import {Err} from './Err.js';
import {Ok} from './Ok.js';

/**
 * Promise.allSettled wrapper for Result
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
 */
async function promiseSettledAsResult<OkType = unknown, ErrType = unknown>(
	callPromise: Promise<ResultOrOkType<OkType, ErrType>>,
): Promise<Result<OkType, ErrType>> {
	const result = (await Promise.allSettled([callPromise]))[0];
	if (result.status === 'fulfilled') {
		return Ok<OkType, ErrType>(result.value);
	} else {
		return Err<OkType, ErrType>(result.reason as ErrType);
	}
}

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
			return promiseSettledAsResult<OkType, ErrType>(func(...args));
			/* c8 ignore next 3 */
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
		return promiseSettledAsResult<OkType, ErrType>(typeof func === 'function' ? func() : func);
		/* c8 ignore next 3 */
	} catch (err) {
		return Err<OkType, ErrType>(err as ErrType);
	}
}
