import {type IAnd, type IAndThen, type IClone, type IEquals, type IOr, type IOrElse, type IUnWrap} from '../interfaces/index.js';
import {type Result} from '../result/index.js';

export interface OptionImplementation<SomeType>
	extends IUnWrap<SomeType, Error>,
		IEquals<Option>,
		IClone<Option<SomeType>>,
		IOr<Option, Option<SomeType>>,
		IOrElse<Option, Option<SomeType>>,
		IAnd<Option, Option<SomeType>>,
		IAndThen<SomeType, Option, INone<SomeType>> {
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
	expect(msgOrError: string | Error): SomeType;

	/**
	 * Returns the contained Some value, consuming the self value.
	 * @example
	 * const x = Some(2);
	 * const y = x.take();
	 * console.log(x.isNone); // true
	 * console.log(y.isSome); // true
	 */
	take(): Option<SomeType>;

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
	match<Output>(solver: Map<SomeType, () => Output>, defaultValue: Output): Output;
	match<Output>(solver: Map<SomeType, () => Output>): Output | undefined;

	/**
	 * Replace the actual value with the given one and returns the old Option.
	 * @param value new value
	 * @returns {Option<SomeType>} old Option
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.replace
	 */
	replace(value: SomeType): Option<SomeType>;

	/**
	 * Inserts value into Option.
	 * @param value new value
	 * @returns {SomeType} currently set value
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.insert
	 */
	insert(value: SomeType): SomeType;

	/**
	 * Inserts value into Option if the option is None, then current set value is returned.
	 * @param value new value
	 * @returns {SomeType} currently set value
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.get_or_insert
	 */
	getOrInsert(value: SomeType): SomeType;

	/**
	 * Converts Option to Result with the given error value if the option is None.
	 * @param err Error value if the option is None
	 * @returns {Result<SomeType, ErrType>} Result
	 */
	toResult<ErrType>(err: ErrType): Result<SomeType, ErrType>;
}

export interface ISome<SomeType> extends Omit<OptionImplementation<SomeType>, 'isNone' | 'isSome'> {
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

export interface INone<SomeType> extends Omit<OptionImplementation<SomeType>, 'isNone' | 'isSome'> {
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
 * Option represents an optional value: every Option is either Some and contains a value and type, or None which does not any type.
 * @template SomeType type of the value
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
export type Option<SomeType = unknown> = ISome<SomeType> | INone<SomeType>;
