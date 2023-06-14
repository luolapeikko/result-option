/* eslint-disable @typescript-eslint/no-explicit-any */
import {IResult, isResult, ResultOrReturnType} from './IResult';
import {Err} from './Err';
import {Ok} from './Ok';

/**
 * build safe wrapper for callback function
 * @template TArgs function arguments
 * @template ReturnType return type
 * @template ErrorType error type
 * @param func callback function
 * @returns IResult
 */
export function safeResultBuilder<TArgs extends any[], ReturnType, ErrorType = unknown>(func: (...args: TArgs) => ResultOrReturnType<ReturnType, ErrorType>) {
	return (...args: TArgs): IResult<ReturnType, ErrorType> => {
		try {
			const data = func(...args);
			// if data is already a Result, return it
			if (isResult(data)) {
				return data;
			}
			return new Ok<ReturnType, ErrorType>(data);
		} catch (err) {
			return new Err<ReturnType, ErrorType>(err as ErrorType);
		}
	};
}

/**
 * safe wrapper for function
 * @param func
 * @template ReturnType return type
 * @template ErrorType error type
 * @returns IResult
 */
export function safeResult<ReturnType, ErrorType = unknown>(func: () => ResultOrReturnType<ReturnType, ErrorType>): IResult<ReturnType, ErrorType> {
	try {
		const data = func();
		// if data is already a Result, return it
		if (isResult(data)) {
			return data;
		}
		return new Ok<ReturnType, ErrorType>(data);
	} catch (err) {
		return new Err<ReturnType, ErrorType>(err as ErrorType);
	}
}
