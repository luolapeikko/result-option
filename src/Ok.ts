import {isResult, ResultBuilder} from './ResultBuilder.js';
import {type Result} from './Result.js';

/**
 * Build Ok result or return if already a Result
 * @template OkType ok type
 * @template ErrType error type
 * @param value - value to wrap or return if already a Result
 * @returns {Result<OkType, ErrType>} - Result
 * @example
 * Ok<number>(2) // Result<number, unknown>
 */
export function Ok<OkType = unknown, ErrType = unknown>(value: OkType | Result<OkType, ErrType>): Result<OkType, ErrType> {
	if (isResult(value)) {
		return value;
	}
	return new ResultBuilder<OkType, ErrType>(true, value) as Result<OkType, ErrType>;
}
