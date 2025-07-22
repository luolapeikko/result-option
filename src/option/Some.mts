import {type IJsonSome} from '../interfaces/IJsonOption.mjs';
import {isJsonSome} from './JsonOption.mjs';
import {type ISome, isSome, OptionBuilder} from './OptionInstance.mjs';

/**
 * Build Some option or return if already a Option
 * @template SomeType
 * @param {SomeType | IJsonSome<SomeType> | ISome<SomeType>} value
 * @returns {ISome<SomeType>}
 * @since v1.0.0
 */
export function Some<SomeType = unknown>(value: SomeType | IJsonSome<SomeType> | ISome<SomeType>): ISome<SomeType> {
	if (isSome<SomeType>(value)) {
		return value;
	}
	if (isJsonSome(value)) {
		return new OptionBuilder<true, SomeType>(true, value.value);
	}
	return new OptionBuilder<true, SomeType>(true, value);
}
