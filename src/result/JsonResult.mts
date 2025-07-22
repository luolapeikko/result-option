import {type IJsonErr, type IJsonOk, type IJsonResult, type IResult} from '../interfaces/index.mjs';
import {Err} from './Err.mjs';
import {type IErr} from './ErrInstance.mjs';
import {Ok} from './Ok.mjs';
import {type IOk} from './OkInstance.mjs';

const resultOkClass = 'Result::Ok';
const resultErrClass = 'Result::Err';

/**
 * Type guard for IJsonResult
 * @template OkType
 * @template ErrType
 * @param {unknown} json
 * @returns {json is IJsonResult<OkType, ErrType>}
 * @since v0.6.6
 */
export function isJsonResult<OkType, ErrType>(json: unknown): json is IJsonResult<OkType, ErrType> {
	return typeof json === 'object' && json !== null && '$class' in json && (json.$class === resultOkClass || json.$class === resultErrClass);
}

/**
 * Type guard for IJsonOk
 * @template OkType
 * @template ErrType
 * @param {unknown} json
 * @returns {json is IJsonOk<OkType>}
 * @since v0.6.6
 */
export function isJsonOk<OkType, ErrType>(json: unknown): json is IJsonOk<OkType> {
	return isJsonResult<OkType, ErrType>(json) && json.$class === resultOkClass;
}

/**
 * Type guard for IJsonErr
 * @template OkType
 * @template ErrType
 * @param {unknown} json
 * @returns {json is IJsonErr<ErrType>}
 * @since v0.6.6
 */
export function isJsonErr<OkType, ErrType>(json: unknown): json is IJsonErr<ErrType> {
	return isJsonResult<OkType, ErrType>(json) && json.$class === resultErrClass;
}

/**
 * wrap Result from JsonResult, IOk or IErr
 * @param {IJsonResult<OkType, ErrType>} json
 * @returns {IResult<OkType, ErrType>}
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
