/* eslint-disable @typescript-eslint/no-explicit-any */
import {type IResult, type IResultOrOkType} from './Result.js';
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
export function safeResultBuilder<TArgs extends any[], OkType = unknown, ErrType = unknown>(func: (...args: TArgs) => IResultOrOkType<OkType, ErrType>) {
	return (...args: TArgs): IResult<OkType, ErrType> => {
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
export function safeResult<OkType = unknown, ErrType = unknown>(func: () => IResultOrOkType<OkType, ErrType>): IResult<OkType, ErrType> {
	try {
		return Ok<OkType, ErrType>(func());
	} catch (err) {
		return Err<OkType, ErrType>(err as ErrType);
	}
}
