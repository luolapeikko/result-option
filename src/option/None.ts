import {type INone} from './Option.js';
import {OptionBuilder} from './OptionBuilder.js';

export function None<SomeType>(): INone<SomeType> {
	return new OptionBuilder<false, SomeType>(false);
}
