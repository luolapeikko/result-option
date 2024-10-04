import {fromJsonOption, isJsonOption} from './JsonOption.mjs';
import {type INone, type IOption, type ISome} from './OptionInstance.mjs';
import {type IJsonOption} from '../interfaces/IJsonOption.mjs';
import {isOption} from './OptionInstance.mjs';
import {None} from './None.mjs';
import {Some} from './Some.mjs';

/**
 * Simple function to wrap a possible undefined value as None
 * @template ValueType type of value
 * @param value value to wrap
 * @returns {IOption<ValueType>} - returns Some(value) or None()
 * @example
 * const valueOption: Option<number> = undefinedOptionWrap<number>(getNumValueOrUndefined());
 */
export function undefinedOptionWrap<ValueType>(value: ValueType | undefined): IOption<ValueType> {
	if (value === undefined) {
		return None();
	}
	return Some(value);
}

/**
 * Simple function to wrap a possible null or undefined value as None
 * @template ValueType type of value
 * @param value value to wrap
 * @returns {IOption<ValueType>} - returns Some(value) or None()
 * @example
 * const valueOption: Option<number> = nullishOptionWrap<number>(getNumValueOrNull());
 */
export function nullishOptionWrap<ValueType>(value: ValueType | null | undefined): IOption<ValueType> {
	if (value === undefined || value === null) {
		return None();
	}
	if (typeof value === 'number' && isNaN(value)) {
		return None();
	}
	return Some(value);
}

/**
 * Simple function to wrap a possible NaN value as None
 * @template ValueType extends number
 * @param value value to wrap
 * @returns {IOption<ValueType>} - returns Some(value) or None()
 * @example
 * nanOption(parseInt(stringNumber, 10)) // returns Some(value) or None()
 */
export function nanOption<ValueType extends number>(value: ValueType): IOption<ValueType> {
	if (isNaN(value)) {
		return None();
	}
	return Some(value);
}
/**
 * get Option from any instance types (Some, None, JsonOption)
 * @param instance instance to convert
 * @returns {IOption<SomeType>} Option instance
 */
export function Option<SomeType>(instance: ISome<SomeType> | INone | IJsonOption<SomeType>): ISome<SomeType> | INone {
	if (isOption(instance)) {
		return instance;
	}
	if (isJsonOption(instance)) {
		return fromJsonOption(instance);
	}
	throw new Error('Invalid Option instance');
}
