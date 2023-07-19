import {AbstractOption} from './AbstractOption';
import {INone} from './Option';

class NoneClass<ReturnType> extends AbstractOption<ReturnType> {
	constructor() {
		super(false);
	}
}

export function None<ReturnType>(): INone<ReturnType> {
	return new NoneClass() as INone<ReturnType>;
}
