import type {CoreResult} from 'core-result';
import {Err} from './Err.mjs';
import type {IResult} from '../interfaces/IResultImplementation.mjs';
import {Ok} from './Ok.mjs';

export type CoreFn = (...args: any[]) => CoreResult<any, any>;
export type CorePromiseFn = (...args: any[]) => Promise<CoreResult<any, any>>;

/**
 * Checks if a value is a CoreResult.
 * @param {unknown} value The value to check.
 * @returns {boolean} True if the value is a CoreResult, false otherwise.
 * @since v2.4.0
 */
export function isCoreResult<OkType, ErrType>(value: unknown): value is CoreResult<OkType, ErrType> {
	return typeof value === 'object' && value !== null && 'success' in value && typeof value.success === 'boolean' && ('value' in value || 'error' in value);
}

/**
 * Converts a CoreResult to an IResult.
 * @param {CoreResult<OkType, ErrType>} value The CoreResult to convert.
 * @returns {IResult<OkType, ErrType>} An IResult representing the same success or error state.
 * @since v2.4.0
 */
export function fromCoreResult<OkType, ErrType>(value: CoreResult<OkType, ErrType>): IResult<OkType, ErrType> {
	return value.success ? Ok(value.value) : Err(value.error);
}
