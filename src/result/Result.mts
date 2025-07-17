import {type IJsonErr, type IJsonOk, type IResult} from '../interfaces/index.mjs';
import {type IErr} from './ErrInstance.mjs';
import {fromJsonResult, isJsonResult} from './JsonResult.mjs';
import {type IOk} from './OkInstance.mjs';
import {isResult} from './ResultInstance.mjs';

/**
 * wrap Result from JsonResult, IOk or IErr
 * @param value - any IResult or JsonResult to wrap as IResult
 * @returns
 * @since v1.0.0
 */
export function Result<_OkType = unknown, ErrType = unknown>(value: IErr<ErrType> | IJsonErr<ErrType>): IErr<ErrType>;
export function Result<OkType = unknown, _ErrType = unknown>(value: IOk<OkType> | IJsonOk<OkType>): IOk<OkType>;
export function Result<OkType = unknown, ErrType = unknown>(
	value: IOk<OkType> | IErr<ErrType> | IJsonOk<OkType> | IJsonErr<ErrType>,
): IResult<OkType, ErrType> {
	if (isResult(value)) {
		return value;
	}
	if (isJsonResult(value)) {
		return fromJsonResult<OkType, ErrType>(value);
	}
	throw new TypeError('Invalid Result type');
}
