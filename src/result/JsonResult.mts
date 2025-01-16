import {type IErr, type IJsonErr, type IJsonOk, type IJsonResult, type IOk, type IResult} from '../interfaces/index.mjs';
import {Err} from './Err.mjs';
import {Ok} from './Ok.mjs';

const resultOkClass = 'Result::Ok';
const resultErrClass = 'Result::Err';

/**
 * Type guard for IJsonResult
 * @since v0.6.6
 */
export function isJsonResult<OkType, ErrType>(json: unknown): json is IJsonResult<OkType, ErrType> {
	return typeof json === 'object' && json !== null && '$class' in json && (json.$class === resultOkClass || json.$class === resultErrClass);
}

/**
 * Type guard for IJsonOk
 * @since v0.6.6
 */
export function isJsonOk<OkType, ErrType>(json: unknown): json is IJsonOk<OkType> {
	return isJsonResult<OkType, ErrType>(json) && json.$class === resultOkClass;
}

/**
 * Type guard for IJsonErr
 * @since v0.6.6
 */
export function isJsonErr<OkType, ErrType>(json: unknown): json is IJsonErr<ErrType> {
	return isJsonResult<OkType, ErrType>(json) && json.$class === resultErrClass;
}

/**
 * wrap Result from JsonResult, IOk or IErr
 * @since v1.0.0
 */
export function fromJsonResult<_OkType, ErrType>(json: IJsonErr<ErrType>): IErr<ErrType>;
export function fromJsonResult<OkType, _ErrType>(json: IJsonOk<OkType>): IOk<OkType>;
export function fromJsonResult<OkType, ErrType>(json: IJsonResult<OkType, ErrType>): IResult<OkType, ErrType>;
export function fromJsonResult<OkType, ErrType>(json: IJsonResult<OkType, ErrType>): IResult<OkType, ErrType> {
	if (json.$class === resultOkClass) {
		return Ok(json.value);
	} else {
		return Err(json.value);
	}
}
