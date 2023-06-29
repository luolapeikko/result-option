import {AbstractOption} from './AbstractOption';
import {Option} from './Option';

class SomeClass<ReturnType> extends AbstractOption<ReturnType> {
	constructor(value: ReturnType) {
		super(true, value);
	}
}

export function Some<ReturnType>(value: ReturnType): Option<ReturnType> {
	return new SomeClass(value);
}
