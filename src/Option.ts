import {ConstructorWithValueOf} from './ValueOf';

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
 * if (result.isSome()) {
 *   console.log('Result: ' + result.unwrap());
 * } else {
 *   console.log('Cannot divide by 0');
 * }
 */
export interface Option<ValueType> {
	/**
	 * Returns true if the option is a Some value.
	 * @example
	 * Some(2).isSome() // true
	 * None<number>().isSome() // false
	 */
	isSome(): boolean;
	/**
	 * Returns true if the option is a None value.
	 * @example
	 * Some(2).isNone() // false
	 * None<number>().isNone() // true
	 */
	isNone(): boolean;
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
	unwrapOr(def: ValueType): ValueType;
	/**
	 * unwraps an option and if not a Some value returns the result of the given function.
	 * @param fn function to call
	 * @example
	 * Some(2).unwrapOrElse(() => 0) // 2
	 * None<number>().unwrapOrElse(() => 2 + 2) // 4
	 */
	unwrapOrElse(fn: () => ValueType): ValueType;
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
	 * console.log(x.isNone()); // true
	 * console.log(y.isSome()); // true
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
}
