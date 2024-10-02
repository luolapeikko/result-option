import {type INone, OptionBuilder} from './OptionInstance.js';
import {type IJsonNone} from '../interfaces/IJsonOption.js';
import {isJsonNone} from './JsonOption.js';
import {isNone} from './OptionInstance.js';

export function None<SomeType = unknown>(noneInstance?: IJsonNone | INone): OptionBuilder<false, SomeType> {
	if (isNone<SomeType>(noneInstance)) {
		return noneInstance;
	}
	if (isJsonNone(noneInstance)) {
		return new OptionBuilder<false, SomeType>(false, undefined as SomeType);
	}
	return new OptionBuilder<false, SomeType>(false, noneInstance as SomeType);
}
