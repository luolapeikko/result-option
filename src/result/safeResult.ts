/* eslint-disable @typescript-eslint/no-explicit-any */
import {type Result, type ResultOrOkType} from './Result.js';
import {Err} from './Err.js';
import {Ok} from './Ok.js';

/**
 * build safe wrapper for callback function
 * @template TArgs function arguments
 * @template OkType return type
 * @template ErrType error type
 * @param func callback function
 * @returns Result
 * @example
 * const existsSync = safeResultBuilder(fs.existsSync);
 * const result: Result<boolean> = existsSync('test.txt');
 */
export function safeResultBuilder<TArgs extends any[], OkType = unknown, ErrType = unknown>(func: (...args: TArgs) => ResultOrOkType<OkType, ErrType>) {
	return (...args: TArgs): Result<OkType, ErrType> => {
		try {
			return Ok<OkType, ErrType>(func(...args));
		} catch (err) {
			return Err<OkType, ErrType>(err as ErrType);
		}
	};
}

/**
 * safe wrapper for function
 * @param func
 * @template OkType return type
 * @template ErrType error type
 * @returns Result
 * @example
 * function test(): number {
 * 	 throw new Error('asd');
 * }
 * const value: Result<number> = safeResult(test);
 */
export function safeResult<OkType = unknown, ErrType = unknown>(func: () => ResultOrOkType<OkType, ErrType>): Result<OkType, ErrType> {
	try {
		return Ok<OkType, ErrType>(func());
	} catch (err) {
		return Err<OkType, ErrType>(err as ErrType);
	}
}
