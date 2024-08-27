/**
 * JSON representation of Some class
 */
export type IJsonSome<SomeType> = {
	$class: 'Option::Some';
	value: SomeType;
};

/**
 * JSON representation of None class
 */
export type IJsonNone = {
	$class: 'Option::None';
};

/**
 * Option as JSON payload
 */
export type IJsonOption<SomeType> = IJsonSome<SomeType> | IJsonNone;
