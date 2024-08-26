import {IJsonErr, IJsonOk, IErr, IOk, IResult} from '../interfaces/index.js';
import {fromJsonResult, isJsonResult} from './JsonResult.js';
import {isResult} from './ResultInstance.js';

/**
 * wrap Result from JsonResult, IOk or IErr
 * @param value - any IResult or JsonResult to wrap as IResult
 * @returns
 */
export function Result<OkType = unknown, ErrType = unknown>(value: IErr<OkType, ErrType> | IJsonErr<ErrType>): IErr<OkType, ErrType>;
export function Result<OkType = unknown, ErrType = unknown>(value: IOk<OkType, ErrType> | IJsonOk<OkType>): IOk<OkType, ErrType>;
export function Result<OkType = unknown, ErrType = unknown>(
	value: IOk<OkType, ErrType> | IErr<OkType, ErrType> | IJsonOk<OkType> | IJsonErr<ErrType>,
): IResult<OkType, ErrType> {
	if (isResult(value)) {
		return value;
	}
	if (isJsonResult(value)) {
		return fromJsonResult(value);
	}
	throw new TypeError('Invalid Result type');
}
