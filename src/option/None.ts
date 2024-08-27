import {isOption, OptionBuilder} from './OptionBuilder.js';
import {type IJsonNone} from '../interfaces/IJsonOption.js';
import {type INone} from './Option.js';

export function None<SomeType>(noneInstance?: IJsonNone | INone<SomeType>): INone<SomeType> {
	if (isOption(noneInstance)) {
		return noneInstance;
	}
	return new OptionBuilder<SomeType>(false, noneInstance) as INone<SomeType>;
}
