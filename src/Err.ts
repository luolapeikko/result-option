import {AbstractResult} from './AbstractResult';
import {IErr} from './Result';

/**
 * Err class for Result implementation
 */
class ErrClass<ReturnType, ErrorType = unknown> extends AbstractResult<ReturnType, ErrorType> {
	constructor(error: ErrorType) {
		super(false, error);
	}
}

export function Err<ReturnType, ErrorType = unknown>(error: ErrorType): IErr<ReturnType, ErrorType> {
	return new ErrClass(error) as IErr<ReturnType, ErrorType>;
}
