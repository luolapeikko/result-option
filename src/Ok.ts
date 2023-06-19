import {AbstractResult} from './AbstractResult';

/**
 * Ok class for Result implementation
 */
export class Ok<ReturnType, ErrorType = unknown> extends AbstractResult<ReturnType, ErrorType> {
	constructor(value: ReturnType) {
		super(true, value);
	}
}
