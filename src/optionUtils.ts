import {None} from './None';
import {Option} from './Option';
import {Some} from './Some';

/**
 * Simple function to wrap a possible undefined value as Option
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
