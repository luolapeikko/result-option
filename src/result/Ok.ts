import {type IResult} from '../interfaces/index.js';
import {isResult} from './ResultInstance.js';
import {OkInstance} from './OkInstance.js';

/**
 * Build Ok result or return if already a Result
 * @template OkType ok type
 * @template ErrType error type
 * @param value - value to wrap or return if already a Result
 * @returns {IResult<OkType, ErrType>} - Result
 * @example
 * Ok<number>(2) // Result<number, unknown>
 */
export function Ok<OkType = unknown, ErrType = unknown>(value: OkType | IResult<OkType, ErrType>): IResult<OkType, ErrType> {
	if (isResult(value)) {
		return value;
	}
	return new OkInstance<OkType, ErrType>(value);
}
