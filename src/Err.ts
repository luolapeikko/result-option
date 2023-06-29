import {AbstractResult} from './AbstractResult';
import {Result} from './Result';

/**
 * Err class for Result implementation
 */
export class ErrClass<ReturnType, ErrorType = unknown> extends AbstractResult<ReturnType, ErrorType> {
	constructor(error: ErrorType) {
		super(false, error);
	}
}

export function Err<ReturnType, ErrorType = unknown>(error: ErrorType): Result<ReturnType, ErrorType> {
	return new ErrClass(error);
}
