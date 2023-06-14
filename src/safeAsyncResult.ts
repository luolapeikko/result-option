/* eslint-disable @typescript-eslint/no-explicit-any */
import {AsyncResult} from './AsyncResult';

/**
 * build safe wrapper for async callback function
 * @template TArgs function arguments
 * @template ReturnType return type
 * @template ErrorType error type
 * @param func async callback function
 * @returns PromiseResult
 * @example
 * const safeAsyncFunc = safeAsyncResult(async (arg1: string, arg2: number) => {
 * 	if (arg1 === 'error') {
 * 		throw new Error('oops');
 * 	}
 * 	return Promise.resolve('hello ${arg1} number: ${arg2}'}');
 * });
 * // wrap fs/promises function to PromiseResult
 * const resultWriteFile = safeAsyncResult(writeFile);
 */
export function safeAsyncResult<TArgs extends any[], ReturnType, ErrorType = unknown>(func: (...args: TArgs) => Promise<ReturnType>) {
	return (...args: TArgs): AsyncResult<ReturnType, ErrorType> => {
		return AsyncResult.from<ReturnType, ErrorType>(() => func(...args));
	};
}
