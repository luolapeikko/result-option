import {AbstractResult} from './AbstractResult';

export class Ok<ReturnType, ErrorType = unknown> extends AbstractResult<ReturnType, ErrorType> {
	constructor(value: ReturnType) {
		super();
		this.value = value;
	}
}
