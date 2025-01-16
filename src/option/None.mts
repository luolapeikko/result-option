import {type IJsonNone} from '../interfaces/IJsonOption.mjs';
import {isJsonNone} from './JsonOption.mjs';
import {type INone, OptionBuilder} from './OptionInstance.mjs';
import {isNone} from './OptionInstance.mjs';

/**
 * None is a class that represents an optional value: every Option is either Some and contains a value and type, or None which does not any type.
 * @since v1.0.0
 */
export function None<SomeType = unknown>(noneInstance?: IJsonNone | INone): OptionBuilder<false, SomeType> {
	if (isNone<SomeType>(noneInstance)) {
		return noneInstance;
	}
	if (isJsonNone(noneInstance)) {
		return new OptionBuilder<false, SomeType>(false, undefined as SomeType);
	}
	return new OptionBuilder<false, SomeType>(false, noneInstance as SomeType);
}
