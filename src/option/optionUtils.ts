import {None} from './None.js';
import {type Option} from './Option.js';
import {Some} from './Some.js';

/**
 * Simple function to wrap a possible undefined value as None
 * @template ValueType type of value
 * @param value value to wrap
 * @returns {Option<ValueType>} - returns Some(value) or None()
 * @example
 * const valueOption: Option<number> = undefinedOptionWrap<number>(getNumValueOrUndefined());
 */
export function undefinedOptionWrap<ValueType>(value: ValueType | undefined): Option<ValueType> {
	if (value === undefined) {
		return None();
	}
	return Some(value);
}

/**
 * Simple function to wrap a possible null or undefined value as None
 * @template ValueType type of value
 * @param value value to wrap
 * @returns {Option<ValueType>} - returns Some(value) or None()
 * @example
 * const valueOption: Option<number> = nullishOptionWrap<number>(getNumValueOrNull());
 */
export function nullishOptionWrap<ValueType>(value: ValueType | null | undefined): Option<ValueType> {
	if (value === undefined || value === null) {
		return None();
	}
	return Some(value);
}
