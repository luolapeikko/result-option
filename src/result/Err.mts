import {type IErr, type IJsonErr, type IResult} from '../interfaces/index.mjs';
import {ErrInstance} from './ErrInstance.mjs';
import {isResult} from './ResultInstance.mjs';

/**
 * Build Err result or return if already a Result
 * @template ErrType error type
 * @template OkType ok type, optional default unknown
 * @param error - error to wrap or return if already a Result
 * @returns {IResult<OkType, ErrType>} - Result
 * @example
 * Err(2); // Result<unknown, number>
 * Err(new Error('Fatal')); // Result<unknown, Error>
 * @since v1.0.0
 */
export function Err<ErrType, _OkType = unknown>(error: ErrType | IErr<ErrType> | IJsonErr<ErrType>): IErr<ErrType>;
export function Err<ErrType, OkType = unknown>(error: ErrType | IResult<OkType, ErrType> | IJsonErr<ErrType>): IResult<OkType, ErrType>;
export function Err<ErrType, OkType = unknown>(error: ErrType | IResult<OkType, ErrType> | IJsonErr<ErrType>): IResult<OkType, ErrType> {
	if (isResult(error)) {
		return error;
	}
	return new ErrInstance<ErrType>(error);
}
