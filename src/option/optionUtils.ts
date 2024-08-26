import {buildFromJsonOption, isJsonOption, type JsonOption} from './JsonOption.js';
import {type INone, type IOption, type ISome} from './Option.js';
import {None} from './None.js';
import {OptionBuilder} from './OptionBuilder.js';
import {Some} from './Some.js';

/**
 * Simple function to wrap a possible undefined value as None
 * @template ValueType type of value
 * @param value value to wrap
 * @returns {ISome<ValueType> | INone<ValueType>} - returns Some(value) or None()
 * @example
 * const valueOption: ISome<ValueType> | INone<ValueType> = undefinedOptionWrap<number>(getNumValueOrUndefined());
 */
export function undefinedOption(value?: undefined): INone<undefined>;
export function undefinedOption<ValueType>(value: NonNullable<ValueType>): ISome<ValueType>;
export function undefinedOption<ValueType>(value?: ValueType | undefined): ISome<ValueType> | INone<undefined>;
export function undefinedOption<ValueType>(value?: ValueType | undefined): ISome<ValueType> | INone<undefined> {
	if (value === undefined) {
		return None<undefined>();
	}
	return Some(value);
}

/**
 * Simple function to wrap a possible null, undefined or NaN value as None
 * @template ValueType type of value
 * @param value value to wrap
 * @returns {ISome<ValueType> | INone<ValueType>} - returns Some(value) or None()
 * @example
 * const valueOption: Option<number> = nullishOptionWrap<number>(getNumValueOrNull());
 */
export function nullishOption(value: null): INone<null>;
export function nullishOption(value?: undefined): INone<undefined>;
export function nullishOption<ValueType>(value: NonNullable<ValueType>): ISome<ValueType>;
export function nullishOption<ValueType>(value?: ValueType | null | undefined): ISome<ValueType> | INone<undefined> | INone<null>;
export function nullishOption<ValueType>(value?: ValueType | null | undefined): ISome<ValueType> | INone<undefined> | INone<null> {
	if (value === undefined || value === null) {
		return None<undefined>();
	}
	if (typeof value === 'number' && isNaN(value)) {
		return None<undefined>();
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
 * @deprecated use undefinedOption() instead
 */

export function undefinedOptionWrap<ValueType extends NonNullable<unknown>>(
	...args: Parameters<typeof undefinedOption<ValueType>>
): ReturnType<typeof undefinedOption<ValueType>> {
	/* c8 ignore next */
	return undefinedOption(...args);
}

/**
 * @deprecated use nullishOption() instead
 */
export function nullishOptionWrap<ValueType extends NonNullable<unknown>>(
	...args: Parameters<typeof nullishOption<ValueType>>
): ReturnType<typeof nullishOption<ValueType>> {
	/* c8 ignore next */
	return nullishOption(...args);
}

/**
 * get Option from any instance types (Some, None, JsonOption)
 * @param instance instance to convert
 * @returns {IOption<SomeType>} Option instance
 */
export function Option<SomeType>(instance: ISome<SomeType> | INone<SomeType> | JsonOption<SomeType>): ISome<SomeType> | INone<SomeType> {
	if (instance instanceof OptionBuilder) {
		return instance;
	}
	if (isJsonOption(instance)) {
		return buildFromJsonOption(instance);
	}
	throw new Error('Invalid Option instance');
}
