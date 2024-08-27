import {isOption, OptionBuilder} from './OptionBuilder.js';
import {type IJsonSome} from '../interfaces/IJsonOption.js';
import {type ISome} from './Option.js';

export function Some<SomeType = unknown>(value: SomeType | IJsonSome<SomeType> | ISome<SomeType>): ISome<SomeType> {
	if (isOption(value)) {
		return value as ISome<SomeType>;
	}
	return new OptionBuilder<SomeType>(true, value) as ISome<SomeType>;
}
