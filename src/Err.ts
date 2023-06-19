import {AbstractResult} from './AbstractResult';

/**
 * Err class for Result implementation
 */
export class Err<ReturnType, ErrorType = unknown> extends AbstractResult<ReturnType, ErrorType> {
	constructor(error: ErrorType) {
		super(false, error);
	}
}
