import {type IOption} from './Option.js';
import {None} from './None.js';
import {Some} from './Some.js';

/**
 * Option as JSON payload
 */
export type JsonOption<SomeType> =
	| {
			$class: 'None';
			value: undefined;
	  }
	| {
			$class: 'Some';
			value: SomeType;
	  };

export function buildFromJsonOption<SomeType>(json: JsonOption<SomeType>): IOption<SomeType> {
	if (json.$class === 'None') {
		return None<SomeType>();
	} else {
		return Some<SomeType>(json.value);
	}
}

export function isJsonOption<SomeType>(json: unknown): json is JsonOption<SomeType> {
	return typeof json === 'object' && json !== null && '$class' in json && (json.$class === 'None' || json.$class === 'Some');
}
