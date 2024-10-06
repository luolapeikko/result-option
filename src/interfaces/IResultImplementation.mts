import {type ConstructorWithValueOf, type IJsonErr, type IJsonOk, type ResultMatchSolver} from './index.mjs';
import {type INone, type ISome} from '../option/index.mjs';

/**
 * Result builder interface
 * @since v1.0.0
 */
export interface IResultBuild<IsOk = true, OkType = unknown, ErrType = unknown> {
	/**
	 * Check that result is not an error
	 * @returns {boolean} true if result is not an error
	 * @example
	 * Ok<number>(2).isOk // true
	 * Err<Error>(new Error('broken')).isOk // false
	 */
	isOk: IsOk;
	/**
	 * Try to get value, otherwise return undefined
	 * @returns {OkType | undefined} value or undefined
	 * @example
	 * Ok<number>(2).ok() // 2
	 * Err<Error>(new Error('broken')).ok() // undefined
	 */
	ok(): IsOk extends true ? OkType : undefined;
	/**
	 * Check that result is an error
	 * @returns {boolean} true if result is an error
	 * @example
	 * Ok<number>(2).isErr // false
	 * Err<Error>(new Error('broken')).isErr // true
	 */
	isErr: IsOk extends false ? true : false;
	/**
	 * Try to get the error, otherwise return undefined
	 * @returns {ErrType | undefined} error or undefined
	 * @example
	 * Ok<number>(2).err() // undefined
	 * Err<Error>(new Error('broken')).err() // Error('broken')
	 */
	err(): IsOk extends false ? ErrType : undefined;
	/**
	 * Method to unwrap the value or throw an error
	 * @param {Error | ((err: ErrorType) => Error)} err - optional error or function to transform the error
	 * @example
	 * Ok<number>(2).unwrap() // 2
	 * Err<Error>(new Error('broken')).unwrap() // throws Error('broken')
	 */
	unwrap(err?: Error | ((err: ErrType) => Error)): IsOk extends true ? OkType : never;
	/**
	 * Method to unwrap the value or if error return the default value
	 * @param defaultValue - default value to return if error
	 * @example
	 * Ok<number>(2).unwrapOr(0) // 2
	 * Err<number>(new Error('broken')).unwrapOr(0) // 0
	 */
	unwrapOr<DefaultType>(defaultValue: DefaultType): IsOk extends true ? OkType : DefaultType;
	/**
	 * Method to unwrap the value or if error return default value from function
	 * @param {() => DefaultType} callbackFunc - function to return default value
	 * @example
	 * Ok<number>(2).unwrapOrElse(() => 0) // 2
	 * Err<number>(new Error('broken')).unwrapOrElse(() => 0) // 0
	 */
	unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType): IsOk extends true ? OkType : DefaultType;
	/**
	 * Method to unwrap the value or if error return default value from constructors valueOf
	 * @param BaseConstructor - constructor to return default value from valueOf
	 * @example
	 * Ok<number>(2).unwrapOrValueOf(Number) // 2
	 * Err<Error>(new Error('broken')).unwrapOrValueOf(Number) // 0 (Number.valueOf())
	 */
	unwrapOrValueOf<ValueType>(BaseConstructor: ConstructorWithValueOf<ValueType>): IsOk extends true ? OkType : ValueType;
	/**
	 * Method to compare two results
	 * @param other - other result to compare
	 * @returns {boolean} true if results are equal
	 * @example
	 * Ok<number>(2).eq(Ok<number>(2)) // true
	 * Ok<number>(2).eq(Ok<number>(3)) // false
	 * Err<number>(2).eq(Err<number>(2)) // true
	 */
	eq(other: IResult): boolean;
	/**
	 * Method to combine two results, if the first result is true return the second result, otherwise return the first result
	 * @param value - compare value
	 * @returns {Result} - Result based on the self value and the value parameter
	 * @example
	 * Err<Error>(new Error('broken')).and(Ok<number>(3)) // Err<Error>(new Error('broken'))
	 * Ok<number>(2).and(Err<number>(new Error('broken'))) // Err<Error>(new Error('broken'))
	 * Ok<number>(2).and(Ok<number>(3)) // Ok<number>(3)
	 */
	and<CompareType>(value: IResult<CompareType>): IsOk extends true ? IResult<CompareType> : this;
	/**
	 * Method to combine two results, if the first result is true use the value to build a new result, otherwise return the error
	 * @param callbackFunc - callback to build a new result
	 * @returns {Result} - Result based on the self value and the value parameter
	 * @example
	 * Ok<number>(2).andThen((val) => Ok<number>(val + 1)) // Ok<number>(3)
	 * Err<'broken'>('broken').andThen<number>((val) => Ok<number>(val + 1)) // Err<'broken'>('broken')
	 */
	andThen<OutType, Override = unknown>(
		callbackFunc: (val: IsOk extends true ? OkType : Override) => IResult<OutType>,
	): IsOk extends true ? IResult<OutType> : this;
	/**
	 * Method to combine two results, if the first result is false return the second result, otherwise return the first result
	 * @param value - compare value
	 * @returns {Result} - Result based on the self value and the value parameter
	 * @example
	 * Err<Error>(new Error('broken')).or(Ok<number>(3)) // Ok<number>(3)
	 * Ok<number>(2).or(Err<Error>(new Error('broken'))) // Ok<number>(2)
	 * Ok<number>(2).or(Ok<number>(3)) // Ok<number>(2)
	 */
	or<CompareType>(value: IResult<CompareType>): IsOk extends true ? this : IResult<CompareType>;
	/**
	 * Method to combine two results, if the first result is false use the error to build a new result, otherwise return the first result
	 * @param callbackFunc - callback to build a new result
	 * @returns {Result} - Result based on the self value and the value parameter
	 * @example
	 * Ok<number>(2).orElse<number, number>((errValue) => Ok(errValue * 2)) // Ok<number>(2)
	 * Err<number>(2).orElse<number>((errValue) => Ok(errValue * 2)) // Ok<number>(4)
	 */
	orElse<CompareType, Override = unknown>(
		callbackFunc: (value: IsOk extends true ? Override : ErrType) => IResult<CompareType>,
	): IsOk extends true ? this : IResult<CompareType>;
	/**
	 * Method to clone an result
	 * @returns {CloneType} - cloned result instance
	 * @example
	 * const x = Ok(2);
	 * const y = x.clone(); // Ok(2)
	 */
	clone(): IResultBuild<IsOk, OkType, ErrType>;
	/**
	 * Method to match the value or error
	 * @param solver - solver callback
	 * @returns {OkOutput | ErrOutput} output
	 * @example
	 * Ok<number>(2).match({
	 * 	Ok: (value) => value * 2,
	 * 	Err: (err) => 0
	 * }) // 4
	 * Err<number>(2).match({
	 * 	Ok: (value) => value * 2,
	 * 	Err: (err) => 0
	 * }) // 0
	 */
	match<OkOutput, ErrOutput>(solver: ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput>): IsOk extends true ? OkOutput : ErrOutput;
	/**
	 * Convert result to option and discard the error type
	 * @returns {ISome<OkType> | INone<never>} option
	 * @example
	 * Ok<number>(2).toOption() // Some<number>(2)
	 * Err<number>(2).toOption() // None<never>()
	 */
	toOption(): IsOk extends true ? ISome<OkType> : INone<never>;
	/**
	 * Convert result to string
	 * @returns {string} string representation of the result
	 * @example
	 * Ok<number>(2).toString() // 'Ok(2)'
	 * Err<number>(2).toString() // 'Err(2)'
	 */
	toString(): IsOk extends true ? `Ok(${string})` : `Err(${string})`;
	/**
	 * Convert result to JSON {$class: 'Result::Ok', value: OkType} or {$class: 'Result::Err', value: ErrType}
	 * @returns {IJsonOk<OkType> | IJsonErr<ErrType>} JSON representation of the result
	 * @example
	 * Ok<number>(2).toJSON() // {$class: 'Result::Ok', value: 2}
	 * Err<number>(2).toJSON() // {$class: 'Result::Err', value: 2}
	 */
	toJSON(): IsOk extends true ? IJsonOk<OkType> : IJsonErr<ErrType>;
}

/**
 * Error result type
 * @since v1.0.0
 */
export type IErr<ErrType = unknown, OkType = never> = IResultBuild<false, OkType, ErrType>;

/**
 * Ok result type
 * @since v1.0.0
 */
export type IOk<OkType = unknown, ErrType = never> = IResultBuild<true, OkType, ErrType>;

/**
 * Result type, this type contains types for both Ok and Err
 * @template OkType Type of the return value, default is unknown
 * @template ErrType Type of the error, default is unknown
 * @example
 * async function action(): Promise<IResult<number>> {
 * try {
 *   return Ok(await getNumber());
 * } catch (e: unknown) {
 *   return Err(e);
 * }
 * const result = await action();
 * if (result.isOk) {
 *   console.log('Result: ' + result.ok());
 * } else {
 *   console.log('Error: ', result.err());
 * }
 * @since v1.0.0
 */
export type IResult<OkType = unknown, ErrType = unknown> = IResultBuild<true, OkType, ErrType> | IResultBuild<false, OkType, ErrType>;

/**
 * Utility type for OkType or Result
 * @template OkType Type of the return value
 * @template ErrType Type of the error, default is unknown
 * @since v1.0.0
 */
export type IResultOrOkType<OkType, ErrType> = OkType | IResult<OkType, ErrType>;
