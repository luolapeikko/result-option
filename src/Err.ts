import {Result} from './Result';
import {ResultBuilder, isResult} from './ResultBuilder';

/**
 * Build Err result or return if already a Result
 * @template OkType ok type
 * @template ErrType error type
 * @param error - error to wrap or return if already a Result
 * @returns {Result<OkType, ErrType>} - Result
 * @example
 * Err(2); // Result<unknown, number>
 * Err(new Error('Fatal')); // Result<unknown, Error>
 */
export function Err<OkType = unknown, ErrType = unknown>(error: ErrType | Result<OkType, ErrType>): Result<OkType, ErrType> {
	if (isResult(error)) {
		return error;
	}
	return new ResultBuilder<OkType, ErrType>(false, error) as Result<OkType, ErrType>;
}
