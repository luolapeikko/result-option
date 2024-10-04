import {type IJsonOk, type IOk, type IResult} from '../interfaces/index.mjs';
import {isResult} from './ResultInstance.mjs';
import {OkInstance} from './OkInstance.mjs';

/**
 * Build Ok result or return if already a Result
 * @template OkType ok type
 * @template ErrType error type, optional default unknown
 * @param value - value to wrap or return if already a Result
 * @returns {IResult<OkType, ErrType>} - Result
 * @example
 * Ok<number>(2) // Result<number, unknown>
 */
export function Ok<OkType, _ErrType = unknown>(value: OkType | IOk<OkType> | IJsonOk<OkType>): IOk<OkType>;
export function Ok<OkType, ErrType = unknown>(value: OkType | IResult<OkType, ErrType> | IJsonOk<OkType>): IResult<OkType, ErrType>;
export function Ok<OkType, ErrType = unknown>(value: OkType | IResult<OkType, ErrType> | IJsonOk<OkType>): IResult<OkType, ErrType> {
	if (isResult(value)) {
		return value;
	}
	return new OkInstance<OkType>(value);
}
