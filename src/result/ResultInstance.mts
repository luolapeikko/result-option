import {ErrInstance} from './ErrInstance.mjs';
import {type IResult} from '../interfaces/index.mjs';
import {OkInstance} from './OkInstance.mjs';

/**
 * Type guard for Result interface
 * @template OkType Type of the return value, default is unknown
 * @template ErrType Type of the error, default is unknown
 * @param {unknown} value unknown value
 * @returns {boolean} true if value is Result
 * @since v0.6.5
 */
export function isResult<OkType = unknown, ErrType = unknown>(value: unknown): value is IResult<OkType, ErrType> {
	return value instanceof OkInstance || value instanceof ErrInstance;
}
