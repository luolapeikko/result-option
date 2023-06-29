import {None} from './None';
import {Option} from './Option';
import {Some} from './Some';

export function undefinedWrap<T>(value: T | undefined): Option<T> {
	if (value === undefined) {
		return None();
	}
	return Some(value);
}
