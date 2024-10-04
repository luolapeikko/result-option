import {type INone, OptionBuilder} from './OptionInstance.mjs';
import {type IJsonNone} from '../interfaces/IJsonOption.mjs';
import {isJsonNone} from './JsonOption.mjs';
import {isNone} from './OptionInstance.mjs';

export function None<SomeType = unknown>(noneInstance?: IJsonNone | INone): OptionBuilder<false, SomeType> {
	if (isNone<SomeType>(noneInstance)) {
		return noneInstance;
	}
	if (isJsonNone(noneInstance)) {
		return new OptionBuilder<false, SomeType>(false, undefined as SomeType);
	}
	return new OptionBuilder<false, SomeType>(false, noneInstance as SomeType);
}
