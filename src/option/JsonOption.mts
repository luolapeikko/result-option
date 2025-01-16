import {type IJsonNone, type IJsonOption, type IJsonSome} from '../interfaces/index.mjs';
import {None} from './None.mjs';
import {type INone, type IOption, type ISome} from './OptionInstance.mjs';
import {Some} from './Some.mjs';

export const optionNoneClass = 'Option::None';
export const optionSomeClass = 'Option::Some';

/**
 * Build Option from JsonOption
 * @since v1.0.0
 */
export function fromJsonOption<SomeType>(json: IJsonNone): INone<SomeType>;
export function fromJsonOption<SomeType>(json: IJsonSome<SomeType>): ISome<SomeType>;
export function fromJsonOption<SomeType>(json: IJsonOption<SomeType>): IOption<SomeType>;
export function fromJsonOption<SomeType>(json: IJsonOption<SomeType>): IOption<SomeType> {
	if (json.$class === optionNoneClass) {
		return None<SomeType>();
	} else {
		return Some<SomeType>(json.value);
	}
}

/**
 * Type guard for JsonOption
 * @since v1.0.0
 */
export function isJsonOption<SomeType>(json: unknown): json is IJsonOption<SomeType> {
	return typeof json === 'object' && json !== null && '$class' in json && (json.$class === optionNoneClass || json.$class === optionSomeClass);
}

/**
 * Type guard for JsonSome
 * @since v1.0.0
 */
export function isJsonSome<SomeType>(json: unknown): json is IJsonSome<SomeType> {
	return isJsonOption(json) && json.$class === optionSomeClass;
}

/**
 * Type guard for JsonNone
 * @since v1.0.0
 */
export function isJsonNone(json: unknown): json is IJsonNone {
	return isJsonOption(json) && json.$class === optionNoneClass;
}

/**
 * Build JsonSome from value
 * @since v1.0.0
 */
export function buildJsonSome<SomeType>(value: SomeType): IJsonSome<SomeType> {
	return {$class: optionSomeClass, value};
}

/**
 * Build JsonNone
 * @since v1.0.0
 */
export function buildJsonNone(): IJsonNone {
	return {$class: optionNoneClass};
}
