import {type IErr, type IOk, type IResult} from '../interfaces/index.js';
import {isResult} from './ResultInstance.js';

/**
 * wrap Result from IOk or IErr
 * @param value - any IResult to wrap as IResult
 * @returns
 */
export function Result<OkType = unknown, ErrType = unknown>(value: IErr<OkType, ErrType>): IErr<OkType, ErrType>;
export function Result<OkType = unknown, ErrType = unknown>(value: IOk<OkType, ErrType>): IOk<OkType, ErrType>;
export function Result<OkType = unknown, ErrType = unknown>(value: IOk<OkType, ErrType> | IErr<OkType, ErrType>): IResult<OkType, ErrType> {
	if (isResult(value)) {
		return value;
	}
	throw new TypeError('Invalid Result type');
}
