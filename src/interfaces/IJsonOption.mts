/**
 * JSON representation of Some class
 * @since v0.6.6
 */
export type IJsonSome<SomeType> = {
	$class: 'Option::Some';
	value: SomeType;
};

/**
 * JSON representation of None class
 * @since v0.6.6
 */
export type IJsonNone = {
	$class: 'Option::None';
};

/**
 * Option as JSON payload
 * @since v0.6.6
 */
export type IJsonOption<SomeType> = IJsonSome<SomeType> | IJsonNone;
