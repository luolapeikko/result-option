import {type IJsonOk, type IOk, type IResult} from '../interfaces/index.js';
import {isJsonResult} from './JsonResult.js';
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
export function Ok<OkType = unknown, ErrType = unknown>(value: OkType | IOk<OkType, ErrType> | IJsonOk<OkType>): IOk<OkType, ErrType>;
export function Ok<OkType = unknown, ErrType = unknown>(value: OkType | IResult<OkType, ErrType> | IJsonOk<OkType>): IResult<OkType, ErrType>;
export function Ok<OkType = unknown, ErrType = unknown>(value: OkType | IResult<OkType, ErrType> | IJsonOk<OkType>): IResult<OkType, ErrType> {
	if (isResult(value)) {
		return value;
	}
	if (isJsonResult(value) && value.$class === 'Ok') {
		return new OkInstance<OkType, ErrType>(value.value);
	}
	return new OkInstance<OkType, ErrType>(value);
}
