import {type IErr, type IJsonErr, type IJsonOk, type IJsonResult, type IOk, type IResult} from '../interfaces/index.js';
import {Err} from './Err.js';
import {Ok} from './Ok.js';

export function isJsonResult<OkType, ErrType>(json: unknown): json is IJsonResult<OkType, ErrType> {
	return typeof json === 'object' && json !== null && '$class' in json && (json.$class === 'Ok' || json.$class === 'Err');
}

export function fromJsonResult<OkType, ErrType>(json: IJsonErr<ErrType>): IErr<OkType, ErrType>;
export function fromJsonResult<OkType, ErrType>(json: IJsonOk<OkType>): IOk<OkType, ErrType>;
export function fromJsonResult<OkType, ErrType>(json: IJsonResult<OkType, ErrType>): IResult<OkType, ErrType>;
export function fromJsonResult<OkType, ErrType>(json: IJsonResult<OkType, ErrType>): IResult<OkType, ErrType> {
	if (json.$class === 'Ok') {
		return Ok(json.value);
	} else {
		return Err(json.value);
	}
}
