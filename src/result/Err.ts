import {isResult, ResultBuilder} from './ResultBuilder.js';
import {type IResult} from './Result.js';

/**
 * Build Err result or return if already a Result
 * @template OkType ok type
 * @template ErrType error type
 * @param error - error to wrap or return if already a Result
 * @returns {IResult<OkType, ErrType>} - Result
 * @example
 * Err(2); // Result<unknown, number>
 * Err(new Error('Fatal')); // Result<unknown, Error>
 */
export function Err<OkType = unknown, ErrType = unknown>(error: ErrType | IResult<OkType, ErrType>): IResult<OkType, ErrType> {
	if (isResult(error)) {
		return error;
	}
	return new ResultBuilder<OkType, ErrType>(false, error) as IResult<OkType, ErrType>;
}
