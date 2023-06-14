import {AbstractResult} from './AbstractResult';

export class Err<ReturnType, ErrorType = unknown> extends AbstractResult<ReturnType, ErrorType> {
	constructor(error: ErrorType) {
		super(false, error);
	}
}
