import {type ISome, isSome, OptionBuilder} from './OptionInstance.js';
import {type IJsonSome} from '../interfaces/IJsonOption.js';
import {isJsonSome} from './JsonOption.js';

export function Some<SomeType = unknown>(value: SomeType | IJsonSome<SomeType> | ISome<SomeType>): ISome<SomeType> {
	if (isSome<SomeType>(value)) {
		return value;
	}
	if (isJsonSome(value)) {
		return new OptionBuilder<true, SomeType>(true, value.value);
	}
	return new OptionBuilder<true, SomeType>(true, value);
}
