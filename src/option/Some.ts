import {type ISome} from './Option.js';
import {OptionBuilder} from './OptionBuilder.js';

export function Some<SomeType = unknown>(value: SomeType): ISome<SomeType> {
	return new OptionBuilder<true, SomeType>(true, value);
}
