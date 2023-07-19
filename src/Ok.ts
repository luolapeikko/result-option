import {AbstractResult} from './AbstractResult';
import {IOk} from './Result';

/**
 * Ok class for Result implementation
 */
class OkClass<ReturnType, ErrorType = unknown> extends AbstractResult<ReturnType, ErrorType> {
	constructor(value: ReturnType) {
		super(true, value);
	}
}

export function Ok<ReturnType, ErrorType = unknown>(value: ReturnType): IOk<ReturnType, ErrorType> {
	return new OkClass(value) as IOk<ReturnType, ErrorType>;
}
