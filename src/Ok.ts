import {AbstractResult} from './AbstractResult';
import {Result} from './Result';

/**
 * Ok class for Result implementation
 */
class OkClass<ReturnType, ErrorType = unknown> extends AbstractResult<ReturnType, ErrorType> {
	constructor(value: ReturnType) {
		super(true, value);
	}
}

export function Ok<ReturnType, ErrorType = unknown>(value: ReturnType): Result<ReturnType, ErrorType> {
	return new OkClass(value);
}
