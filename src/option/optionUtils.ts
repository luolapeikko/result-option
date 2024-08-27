import {type IOption} from './Option.js';
import {None} from './None.js';
import {Some} from './Some.js';

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
