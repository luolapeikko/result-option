import {ConstructorWithValueOf} from './ValueOf';

export interface OptionImplementation<ValueType> {
	/**
	 * Returns true if the option is a Some value.
	 * @example
	 * Some(2).isSome // true
	 * None<number>().isSome // false
	 */
	isSome: boolean;
	/**
	 * Returns true if the option is a None value.
	 * @example
	 * Some(2).isNone // false
	 * None<number>().isNone // true
	 */
	isNone: boolean;
	/**
	 * expect unwraps an option and if not a Some value throws an error with the given message.
	 * @param msgOrError message or error to throw
	 * @example
	 * Some(2).expect('the world is ending') // 2
	 * None<number>().expect('the world is ending') // throws Error('the world is ending')
	 */
	expect(msgOrError: string | Error): ValueType;
	/**
	 * unwraps an option and if not a Some value throws an error.
	 * @param err optional function to transform the error
	 * @example
	 * Some(2).unwrap() // 2
	 * None<number>().unwrap() // throws Error
	 */
	unwrap(err?: (err: Error) => Error): ValueType;
	/**
	 * unwraps an option and if not a Some value returns the given default value.
	 * @param def default value
	 * @example
	 * Some(2).unwrapOr(0) // 2
	 * None<number>().unwrapOr(0) // 0
	 */
	unwrapOr<DefType>(def: DefType): DefType | ValueType;
	/**
	 * unwraps an option and if not a Some value returns the result of the given function.
	 * @param fn function to call
	 * @example
	 * Some(2).unwrapOrElse(() => 0) // 2
	 * None<number>().unwrapOrElse(() => 2 + 2) // 4
	 */
	unwrapOrElse<DefType>(fn: () => DefType): DefType | ValueType;
	/**
	 * unwraps an option and if not a Some value returns the default value from the constructor.
	 * @param cons Constructor
	 * @returns the default value
	 * @example
	 * Some(2).unwrapOrValueOf(Number) // 2
	 * None<number>().unwrapOrValueOf(Number) // 0
	 */
	unwrapOrValueOf(cons: ConstructorWithValueOf<ValueType>): ValueType;
	/**
	 * Returns the contained Some value, consuming the self value.
	 * @example
	 * const x = Some(2);
	 * const y = x.take();
	 * console.log(x.isNone); // true
	 * console.log(y.isSome); // true
	 */
	take(): Option<ValueType>;
	/**
	 * Returns a copy of the option.
	 * @example
	 * const x = Some(2);
	 * const y = x.clone(); // y is Some(2)
	 */
	clone(): Option<ValueType>;
	/**
	 * eq returns true if the option is equal to the given option.
	 * @param other option to compare
	 * @example
	 * Some(2).eq(Some(2)) // true
	 */
	eq(other: Option<ValueType>): boolean;

	/**
	 * match executes the given function if the option is a Some value, otherwise returns the default value.
	 * @template Output type of the result
	 * @param solver map of functions to execute
	 * @param defaultValue optional default value
	 * @returns {Output | undefined} the result of the executed function or the default value
	 * @example
	 * const output: string = Some(1).match(
	 *   new Map([
	 *     [1, () => 'one'],
	 *     [2, () => 'two'],
	 *   ]),
	 *   'other',
	 * );
	 */
	match<Output>(solver: Map<ValueType, () => Output>): Output | undefined;
	match<Output>(solver: Map<ValueType, () => Output>, defaultValue: Output): Output;
}

export interface ISome<ValueType> extends Omit<OptionImplementation<ValueType>, 'isNone' | 'isSome'> {
	/**
	 * Returns true if the option is a None value.
	 * @example
	 * Some(2).isNone // false
	 */
	isNone: false;
	/**
	 * Returns true if the option is a Some value.
	 * @example
	 * Some(2).isSome // true
	 */
	isSome: true;
}

export interface INone<ValueType> extends Omit<OptionImplementation<ValueType>, 'isNone' | 'isSome'> {
	/**
	 * Returns true if the option is a None value.
	 * @example
	 * None<number>().isNone // true
	 */
	isNone: true;
	/**
	 * Returns true if the option is a Some value.
	 * @example
	 * None<number>().isSome // false
	 */
	isSome: false;
}

/**
 * Option represents an optional value.
 * @template ValueType type of the value
 * @example
 * function divide(numerator: number, denominator: number): Option<number> {
 *   if (denominator === 0) {
 *     return None<number>();
 *   }
 *   return Some(numerator / denominator);
 * }
 * const result = divide(2, 3);
 * if (result.isSome) {
 *   console.log('Result: ' + result.unwrap());
 * } else {
 *   console.log('Cannot divide by 0');
 * }
 */
export type Option<ValueType> = ISome<ValueType> | INone<ValueType>;
