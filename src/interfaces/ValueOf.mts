/**
 * Primitive classes provide a valueOf method that returns a value from an object.
 * @template ValueType return type of the valueOf method
 */
export interface ValueOf<ValueType> {
	valueOf(): ValueType;
}

/**
 * Class constructor with a valueOf method that returns a value from an object.
 * @template ValueType return type of the valueOf method
 * @example
 * Number class => new Number().valueOf() // 0
 * String class => new String().valueOf() // ''
 */
export type ConstructorWithValueOf<ValueType> = new (...args: never[]) => ValueOf<ValueType>;
