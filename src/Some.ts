import {AbstractOption} from './AbstractOption';
import {ISome} from './Option';

class SomeClass<ReturnType> extends AbstractOption<ReturnType> {
	constructor(value: ReturnType) {
		super(true, value);
	}
}

export function Some<ReturnType>(value: ReturnType): ISome<ReturnType> {
	return new SomeClass(value) as ISome<ReturnType>;
}
