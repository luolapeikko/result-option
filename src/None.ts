import {OptionBuilder} from './OptionBuilder';
import {INone} from './Option';

export function None<SomeType>(): INone<SomeType> {
	return new OptionBuilder<SomeType>(false) as INone<SomeType>;
}
