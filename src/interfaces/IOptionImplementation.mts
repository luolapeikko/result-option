import {type IOption} from '../option/OptionInstance.mjs';
import {type IErr, type IOk} from '../result/index.mjs';
import {type IJsonNone, type IJsonSome} from './IJsonOption.mjs';
import {type OptionMatchSolver} from './IMatch.mjs';
import {type ConstructorWithValueOf} from './ValueOf.mjs';

/**
 * MappedType is a type that maps a boolean to a type.
 * @since v1.0.0
 */
export type MappedType<IsTrue extends boolean, TrueType, FalseType> = {true: TrueType; false: FalseType}[`${IsTrue}`];

/**
 * function to resolve the mapped type
 * @param {IsTrue} isTrue - boolean to resolve the type
 * @param {TrueType} trueValue - type to return if isTrue is true
 * @param {FalseType} falseValue - type to return if isTrue is false
 * @returns {MappedType<IsTrue, TrueType, FalseType>}
 * @since v1.0.0
 */
export function asMapped<IsTrue extends boolean, TrueType, FalseType>(
	isTrue: IsTrue,
	trueValue: TrueType,
	falseValue: FalseType,
): MappedType<IsTrue, TrueType, FalseType> {
	return {true: trueValue, false: falseValue}[`${isTrue}`];
}

/**
 * Option implementation
 * @since v1.0.0
 */
export interface IOptionImplementation<IsTrue extends boolean, SomeType> {
	/**
	 * Returns true if the option is a Some value.
	 * @example
	 * Some(2).isSome // true
	 * None<number>().isSome // false
	 */
	isSome: MappedType<IsTrue, true, false>;
	/**
	 * Returns true if the option is a None value.
	 * @example
	 * Some(2).isNone // false
	 * None<number>().isNone // true
	 */
	isNone: MappedType<IsTrue, false, true>;
	/**
	 * Inserts value into Option.
	 * @param value new value
	 * @returns {SomeType} currently set value
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.insert
	 */
	insert(value: SomeType): SomeType;
	/**
	 * Method to clone an Option
	 * @returns {SomeType} - cloned Option instance
	 * @example
	 * const x = Some(2);
	 * const y = x.clone();
	 */
	cloned(): IOptionImplementation<IsTrue, SomeType>;
	/**
	 * Returns the contained Some value, consuming the self value.
	 *
	 * Warning: currently TS can't change type of "this" (with asserts) and return value at the same time.
	 * https://github.com/microsoft/TypeScript/issues/41339
	 * @returns {IOption<SomeType>} copy of original Option
	 * @example
	 * const x = Some(2);
	 * const y = x.take();
	 * console.log(x.isNone); // true
	 * console.log(y.isSome); // true
	 */
	take(): IOptionImplementation<IsTrue, SomeType | undefined>;
	/**
	 * Replace the actual value with the given one and returns the old Option.
	 *
	 * Warning: currently TS can't change type of "this" (with asserts) and return value at the same time.
	 * https://github.com/microsoft/TypeScript/issues/41339
	 * @param value new value
	 * @returns {IOption<SomeType>} old Option
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.replace
	 */
	replace(value: SomeType): IOptionImplementation<IsTrue, SomeType>;
	/**
	 * Method to unwrap the value or throw an error if None
	 * @param {Error | ((err: ErrorType) => Error)} err - optional error or function to transform the error
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap
	 * @example
	 * Some(2).unwrap() // 2
	 * None<number>().unwrap() // throws Error
	 */
	unwrap(err?: Error | ((err: Error) => Error)): MappedType<IsTrue, SomeType, never>;
	/**
	 * Method to unwrap the value or if None then return the default value.
	 * @param defaultValue - default value to return
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap_or
	 * @example
	 * Some(2).unwrapOr(3) // 2
	 * None<number>().unwrapOr(3) // 3
	 */
	unwrapOr<DefType>(defaultValue: DefType): MappedType<IsTrue, SomeType, DefType>;
	/**
	 * Method to unwrap the value or if None then return the default value from function.
	 * @param {() => DefaultType} fn - function to return default value
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap_or_else
	 * @example
	 * Some(2).unwrapOrElse(() => 3) // 2
	 * None<number>().unwrapOrElse(() => 3) // 3
	 */
	unwrapOrElse<DefType>(fn: () => DefType): MappedType<IsTrue, SomeType, DefType>;
	/**
	 * Method to unwrap the value or if None then return the default value from constructors valueOf (mimic Rust unwrap_or_default).
	 * @param BaseConstructor - constructor to return default value from valueOf
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap_or_default
	 * @example
	 * Some(2).unwrapOrValueOf(Number) // 2
	 * None<number>().unwrapOrValueOf(Number) // 0
	 */
	unwrapOrValueOf<DefType>(BaseConstructor: ConstructorWithValueOf<DefType>): MappedType<IsTrue, SomeType, DefType>;
	/**
	 * Compare two Options
	 */
	eq(other: IOption): boolean;
	/**
	 * Method to compare two Options with or operation
	 * @param value - other Option to compare
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.or
	 * @example
	 * Some(2).or(Some(3)) // Some(2)
	 * None().or(Some(3)) // Some(3)
	 */
	or<ValueType>(value: IOption<ValueType>): MappedType<IsTrue, this, IOption<ValueType>>;
	/**
	 * Method to compare two Options with or operation
	 * @param callbackFunc - function to return default value
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.or_else
	 * @example
	 * Some(2).orElse(() => Some(3)) // Some(2)
	 * None().orElse(() => Some(3)) // Some(3)
	 */
	orElse<ValueType>(callbackFunc: (value: SomeType) => IOption<ValueType>): MappedType<IsTrue, this, IOption<ValueType>>;
	/**
	 * Method to compare two Options with and operation
	 * @param value - other Option to compare
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.and
	 * @example
	 * Some(2).and(Some(3)) // Some(3)
	 * None().and(Some(3)) // None()
	 * Some(2).and(None()) // None()
	 * None().and(None()) // None()
	 */
	and<CompareType>(value: IOption<CompareType>): MappedType<IsTrue, IOption<CompareType>, this>;
	/**
	 * Method to compare two Options with andThen operation
	 * @param callbackFunc - function to return default value
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.and_then
	 * @example
	 * Some(2).andThen((val) => Some(val + 1)) // Some(3)
	 * None().andThen<number>((val) => Some(val + 1)) // None()
	 */
	andThen<CompareType, OverrideType = unknown>(
		callbackFunc: (value: MappedType<IsTrue, SomeType, OverrideType>) => IOption<CompareType>,
	): MappedType<IsTrue, IOption<CompareType>, this>;
	/**
	 * Method to get the value or insert a new value
	 * @param value - value to insert if None
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.get_or_insert
	 * @example
	 * Some(2).getOrInsert(3) // 2
	 * None().getOrInsert(3) // 3
	 */
	getOrInsert(value: SomeType): SomeType;
	/**
	 * Match the Option value with a solver
	 * @param solver - solver to match the value (Map key to match, callback as resolver)
	 * @param defaultValue - default value if no match
	 * @see https://doc.rust-lang.org/std/option/enum.Option.html#method.match
	 * @example
	 * Some(1).match(
	 *   new Map([
	 *     [1, () => 'one'],
	 *     [2, () => 'two'],
	 *   ]),
	 *   'other', // default value
	 * ); // 'one'
	 * None().match(
	 *   new Map([
	 *     [1, () => 'one'],
	 *     [2, () => 'two'],
	 *   ]),
	 *   'other', // default value
	 * ); // 'other'
	 */
	match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue?: Output): Output | undefined;
	match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue: Output): Output;

	/**
	 * Map the Option value to a new value if Some
	 * @param fn
	 * @example
	 * Some("text").map((v)=> Buffer.from(v)) // Some<Buffer>
	 * None<string>().map((v)=> Buffer.from(v)) // None<Buffer>
	 * @since v1.0.4
	 */
	map<NewType>(fn: (value: SomeType) => NewType): MappedType<IsTrue, IOptionImplementation<true, NewType>, IOptionImplementation<false, NewType>>;
	/**
	 * expect the Option to be Some or throw an error
	 * @param error
	 * @example
	 * Some(2).expect('error message') // 2
	 * None().expect('error message') // throws new Error('error message')
	 */
	expect(error: string | Error): MappedType<IsTrue, SomeType, never>;
	/**
	 * Convert Option to Result and discard the error type
	 * @returns {IOk<SomeType> | INone<never>} Result
	 * @example
	 * Some(2).toResult() // Ok<number>(2)
	 * None().toResult() // Err<never>()
	 */

	toResult<ErrType>(err: ErrType): MappedType<IsTrue, IOk<SomeType>, IErr<ErrType>>;
	/**
	 * Convert Option to JSON
	 * @returns {IJsonSome<SomeType> | IJsonNone} JSON
	 * @example
	 * Some(2).toJSON() // {$class: 'Option::Some', value: 2}
	 * None().toJSON() // {$class: 'Option::None'}
	 */
	toJSON(): MappedType<IsTrue, IJsonSome<SomeType>, IJsonNone>;

	/**
	 * Convert Option to string
	 * @returns {string} string representation of the Option
	 * @example
	 * Some(2).toString() // 'Some(2)'
	 * None().toString() // 'None()'
	 */
	toString() : MappedType<IsTrue, `Some(${string})`, 'None()'>;
}
