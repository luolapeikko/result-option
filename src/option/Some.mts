import {type ISome, isSome, OptionBuilder} from './OptionInstance.mjs';
import {type IJsonSome} from '../interfaces/IJsonOption.mjs';
import {isJsonSome} from './JsonOption.mjs';

export function Some<SomeType = unknown>(value: SomeType | IJsonSome<SomeType> | ISome<SomeType>): ISome<SomeType> {
	if (isSome<SomeType>(value)) {
		return value;
	}
	if (isJsonSome(value)) {
		return new OptionBuilder<true, SomeType>(true, value.value);
	}
	return new OptionBuilder<true, SomeType>(true, value);
}
