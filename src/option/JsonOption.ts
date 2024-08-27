import {type IJsonNone, type IJsonOption, type IJsonSome} from '../interfaces/index.js';
import {type INone, type IOption, type ISome} from './Option.js';
import {None} from './None.js';
import {Some} from './Some.js';

export function fromJsonOption<SomeType>(json: IJsonNone): INone<SomeType>;
export function fromJsonOption<SomeType>(json: IJsonSome<SomeType>): ISome<SomeType>;
export function fromJsonOption<SomeType>(json: IJsonOption<SomeType>): IOption<SomeType>;
export function fromJsonOption<SomeType>(json: IJsonOption<SomeType>): IOption<SomeType> {
	if (json.$class === 'Option::None') {
		return None<SomeType>();
	} else {
		return Some<SomeType>(json.value);
	}
}

export function isJsonOption<SomeType>(json: unknown): json is IJsonOption<SomeType> {
	return typeof json === 'object' && json !== null && '$class' in json && (json.$class === 'Option::None' || json.$class === 'Option::Some');
}

export function getJsonOptionValue<SomeType>(option: IJsonOption<SomeType>): SomeType | undefined {
	if (option.$class === 'Option::Some') {
		return option.value;
	}
	return undefined;
}
