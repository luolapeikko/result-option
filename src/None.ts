import {AbstractOption} from './AbstractOption';
import {Option} from './Option';

class NoneClass<ReturnType> extends AbstractOption<ReturnType> {
	constructor() {
		super(false);
	}
}

export function None<ReturnType>(): Option<ReturnType> {
	return new NoneClass();
}
