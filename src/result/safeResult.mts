/* eslint-disable @typescript-eslint/no-explicit-any */
import {type IResult, type IResultOrOkType} from '../interfaces/IResultImplementation.mjs';
import {Err} from './Err.mjs';
import {Ok} from './Ok.mjs';

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
 * @since v1.0.0
 */
export function safeResultBuilder<TArgs extends any[], OkType, ErrType>(func: (...args: TArgs) => IResultOrOkType<OkType, ErrType>) {
	return (...args: TArgs): IResult<OkType, ErrType> => {
		try {
			return Ok(func(...args));
		} catch (err) {
			return Err(err as ErrType);
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
 * @since v1.0.0
 */
export function safeResult<OkType = unknown, ErrType = unknown>(func: () => IResultOrOkType<OkType, ErrType>): IResult<OkType, ErrType> {
	try {
		return Ok(func());
	} catch (err) {
		return Err(err as ErrType);
	}
}
