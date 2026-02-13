import {type IErr, type IOk} from '../index.mjs';
import {type INone, type ISome} from '../option/index.mjs';
import type { AsyncResult } from '../result/AsyncResult.mjs';
import {type ConstructorWithValueOf, type IJsonErr, type IJsonOk} from './index.mjs';


/**
 * Awaitable Result type, this type contains types for both Ok and Err and can be used with async/await
 * @since v3.0.0
 */
export type AwaitableIResult<OkType, ErrType> = IResult<OkType, ErrType> | Promise<IResult<OkType, ErrType>> | AsyncResult<OkType, ErrType>;

/**
 * Ok interface, this is the main interface for the Ok type and contains all the methods for both Ok and Err
 * @template OkType - Ok type
 * @template ErrType - Err type
 * @since v3.0.0
 */
export interface IOkBuilder<OkType, ErrType = never> {
	readonly isOk: true;
	readonly isErr: false;
	ok(): OkType;
	isOkAnd(callback: (value: OkType) => boolean): boolean;
	isErrAnd(callback: (value: ErrType) => boolean): false;
	err(): undefined;
	and<NextOkType, NextErrType = never>(
		other: AwaitableIResult<NextOkType, NextErrType>,
	): IResult<NextOkType, ErrType | NextErrType> | AsyncResult<NextOkType, ErrType | NextErrType>;
	andThen<NextOkType, NextErrType = never>(
		callback: (value: OkType) => AwaitableIResult<NextOkType, NextErrType>,
	): IResult<OkType | NextOkType, ErrType | NextErrType> | AsyncResult<OkType | NextOkType, ErrType | NextErrType>;
	map<OutType>(callback: (value: OkType) => OutType): IResult<OutType, ErrType>;
	mapErr<OutType>(callback: (value: ErrType) => OutType): this;
	or<NextOkType, NextErrType>(other: AwaitableIResult<NextOkType, NextErrType>): this;
	orElse<NextOkType, NextErrType = never>(callback: (value: ErrType) => AwaitableIResult<NextOkType, NextErrType>): this;
	unwrap(): OkType;
	unwrapOr<OutType>(defaultValue: OutType): OkType;
	unwrapOrElse<OutType>(orElseCallback: (value: ErrType) => OutType): OkType;
	unwrapOrValueOf<ValueType>(BaseConstructor: ConstructorWithValueOf<ValueType>): OkType;
	eq(other: IResult<unknown, unknown>): boolean;
	clone(): IResult<OkType, ErrType>;
	inspectOk(fn: (value: OkType) => void): this;
	inspectErr(fn: (value: ErrType) => void): this;
	toString(): `Ok(${string})`;
	toJSON(): {
		$class: 'Result::Ok';
		value: OkType;
	};
	toOption(): ISome<OkType>;
	iter(): IterableIterator<ISome<OkType>, ISome<OkType>>;
}

/**
 * Err interface, this is the main interface for the Err type and contains all the methods for both Ok and Err
 * @template ErrType - Err type
 * @template OkType - Ok type
 * @since v3.0.0
 */
export interface IErrBuilder<ErrType, OkType = never> {
	readonly isOk: false;
	readonly isErr: true;
	ok(): undefined;
	isOkAnd(callback: (value: OkType) => boolean): false;
	isErrAnd(callback: (value: ErrType) => boolean): boolean;
	err(): ErrType;
	and<NextOkType, NextErrType = never>(other: AwaitableIResult<NextOkType, NextErrType>): IErrBuilder<ErrType, NextOkType | OkType>;
	andThen<NextOkType, NextErrType = never>(callback: (value: OkType) => AwaitableIResult<NextOkType, NextErrType>): IErrBuilder<ErrType, NextOkType | OkType>;
	map<OutType>(callback: (value: OkType) => OutType): this;
	mapErr<OutType>(callback: (value: ErrType) => OutType): IResult<OkType, OutType>;
	or<NextOkType, NextErrType>(
		other: AwaitableIResult<NextOkType, NextErrType>,
	): IResult<OkType | NextOkType, NextErrType> | AsyncResult<OkType | NextOkType, NextErrType>;
	orElse<NextOkType, NextErrType = never>(
		orElseCallback: (value: ErrType) => AwaitableIResult<NextOkType, NextErrType>,
	): IResult<OkType | NextOkType, NextErrType> | AsyncResult<OkType | NextOkType, NextErrType>;
	unwrap(): never;
	unwrapOr<OutType>(defaultValue: OutType): OutType;
	unwrapOrElse<OutType>(orElseCallback: (value: ErrType) => OutType): OutType;
	unwrapOrValueOf<OutType>(BaseConstructor: ConstructorWithValueOf<OutType>): OutType;
	eq(other: IResult<unknown, unknown>): boolean;
	clone(): IResult<OkType, ErrType>;
	inspectOk(fn: (value: OkType) => void): this;
	inspectErr(fn: (value: ErrType) => void): this;
	toString(): `Err(${string})`;
	toJSON(): {
		$class: 'Result::Err';
		value: ErrType;
	};
	toOption(): INone<never>;
	iter(): IterableIterator<INone<never>, INone<never>>;
}

/**
 * Async Result interface, this is the main interface for the Result type and contains all the methods for both Ok and Err
 * @template OkType - Ok type
 * @template ErrType - Err type
 * @since v3.0.0
 */
export interface IAsyncResult<OkType, ErrType> {
	isOk: Promise<boolean>;
	isErr: Promise<boolean>;
	ok(): Promise<OkType | undefined>;
	isOkAnd(callback: (value: OkType) => boolean): Promise<boolean>;
	isErrAnd(callback: (value: ErrType) => boolean): Promise<boolean>;
	err(): Promise<ErrType | undefined>;
	and<NextOkType, NextErrType>(other: AwaitableIResult<NextOkType, NextErrType>): AsyncResult<NextOkType, ErrType | NextErrType>;
	andThen<NextOkType, NextErrType>(callback: (value: OkType) => AwaitableIResult<NextOkType, NextErrType>): AsyncResult<NextOkType, ErrType | NextErrType>;
	map<OutType>(callback: (value: OkType) => OutType | Promise<OutType>): AsyncResult<OutType, ErrType>;
	mapErr<OutType>(callback: (value: ErrType) => OutType | Promise<OutType>): AsyncResult<OkType, OutType>;
	or<NextOkType, NextErrType>(other: AwaitableIResult<NextOkType, NextErrType>): AsyncResult<OkType | NextOkType, NextErrType>;
	orElse<NextOkType, NextErrType>(orElseCallback: (value: ErrType) => AwaitableIResult<NextOkType, NextErrType>): AsyncResult<OkType | NextOkType, NextErrType>;
	unwrap(): Promise<OkType>;
	unwrapOr<OutType>(defaultValue: OutType): Promise<OkType | OutType>;
	unwrapOrElse<OutType>(orElseCallback: (value: ErrType) => OutType): Promise<OkType | OutType>;
	unwrapOrValueOf<OutType>(BaseConstructor: ConstructorWithValueOf<OutType>): Promise<OkType | OutType>;
	eq(other: IResult<unknown, unknown>): Promise<boolean>;
	clone(): AsyncResult<OkType, ErrType>;
	inspectOk(fn: (value: OkType) => void): this;
	inspectErr(fn: (value: ErrType) => void): this;
	toString(): Promise<`Ok(${string})` | `Err(${string})`>;
	toJSON(): Promise<
		| {
				$class: 'Result::Ok';
				value: OkType;
		  }
		| {
				$class: 'Result::Err';
				value: ErrType;
		  }
	>;
	toOption(): Promise<ISome<OkType> | INone<never>>;
	iter(): AsyncIterableIterator<ISome<OkType> | INone<never>, ISome<OkType> | INone<never>>;
}

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
	 * Check that result is an error
	 * @returns {boolean} true if result is an error
	 * @example
	 * Ok<number>(2).isErr // false
	 * Err<Error>(new Error('broken')).isErr // true
	 */
	isErr: IsOk extends false ? true : false;

	/**
	 * Returns true if the result is Ok and callback function returns true for the value inside of Ok.
	 * @param {(value: OkType) => boolean} callbackFunc - function to check the value inside of Ok
	 * @returns {boolean} true if the result is Ok and the callback function returns true for the value inside of Ok
	 * @example
	 * Ok<number>(2).isOkAnd((value) => value === 2) // true
	 * Ok<number>(2).isOkAnd((value) => value === 3) // false
	 * Err<Error>(new Error('broken')).isOkAnd((value) => value === 2) // false
	 * @since v1.0.8
	 */
	isOkAnd(callbackFunc: (value: OkType) => boolean): IsOk extends true ? boolean : false;

	/**
	 * Returns true if the result is Err and callback function returns true for the value inside of Err.
	 * @param {(value: ErrType) => boolean} callback - function to check the value inside of Err
	 * @returns {boolean} true if the result is Err and the callback function returns true for the value inside of Err
	 * @example
	 * Err<Error>(new Error('broken')).isErrAnd((err) => err.message === 'broken') // true
	 * Err<Error>(new Error('broken')).isErrAnd((err) => err.message === 'not broken') // false
	 * Ok<number>(2).isErrAnd((err) => err.message === 'broken') // false
	 * @since v1.0.8
	 */
	isErrAnd(callbackFunc: (value: ErrType) => boolean): IsOk extends false ? boolean : false;

	/**
	 * Try to get value, otherwise return undefined
	 * @returns {OkType | undefined} value or undefined
	 * @example
	 * Ok<number>(2).ok() // 2
	 * Err<Error>(new Error('broken')).ok() // undefined
	 */
	ok(): IsOk extends true ? OkType : undefined;

	/**
	 * Try to get the error, otherwise return undefined
	 * @returns {ErrType | undefined} error or undefined
	 * @example
	 * Ok<number>(2).err() // undefined
	 * Err<Error>(new Error('broken')).err() // Error('broken')
	 */
	err(): IsOk extends false ? ErrType : undefined;
	/**
	 * Method to unwrap the value or throw an error.
	 *
	 * Note: Error argument/callback was removed in favor of the `.errMap((e) => new Error(e.message)).unwrap()` method.
	 * @example
	 * Ok<number>(2).unwrap() // 2
	 * Err<Error>(new Error('broken')).unwrap() // throws Error('broken')
	 */
	unwrap(): IsOk extends true ? OkType : never;
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
	 * Ok<number>(2).andThen<IResult<number>>((val) => Ok(val + 1)) // Ok<number>(3)
	 * Err<'broken'>('broken').andThen<IResult<number>>((val) => Ok(val + 1)) // Err<'broken'>('broken')
	 */
	andThen<OutResult extends IResult<unknown, unknown>>(
		callbackFunc: (val: IsOk extends true ? OkType : never) => OutResult,
	): IsOk extends true ? OutResult : this;
	/**
	 * Method to combine two results, if the first result is true use the value to build a new result from Promise, otherwise return the error
	 * @param callbackFunc - callback to build a new result
	 * @returns {Result} - Result based on the self value and the value parameter
	 * @example
	 * await Ok<number>(2).andThen<IResult<number>>((val) => Promise.resolve(Ok(val + 1))) // Ok<number>(3)
	 * await Err<'broken'>('broken').andThen<IResult<number>>((val) => Promise.resolve(Ok(val + 1))) // Err<'broken'>('broken')
	 */
	andThenPromise<OutResult extends IResult<unknown, unknown>>(
		callbackFunc: (val: IsOk extends true ? OkType : never) => OutResult | Promise<OutResult>,
	): IsOk extends true ? Promise<OutResult> : this;
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
	 * Ok<number>(2).orElse<IResult<number>>((errValue) => Ok(errValue * 2)) // Ok<number>(2)
	 * Err<number>(2).orElse<IResult<number>>((errValue) => Ok(errValue * 2)) // Ok<number>(4)
	 */
	orElse<OutResult extends IResult<unknown, unknown>>(
		callbackFunc: (value: IsOk extends true ? never : ErrType) => OutResult,
	): IsOk extends true ? this : OutResult;
	/**
	 * Method to combine two results, if the first result is false use the error to build a new result from Promise, otherwise return the first result
	 * @param callbackFunc - callback to build a new result
	 * @returns {Result} - Result based on the self value and the value parameter
	 * @example
	 * await Ok<number>(2).orElsePromise<IResult<number>>((errValue) => Promise.resolve(Ok(errValue * 2))) // Ok<number>(2)
	 * await Err<number>(2).orElsePromise<IResult<number>>((errValue) => Promise.resolve(Ok(errValue * 2))) // Ok<number>(4)
	 */
	orElsePromise<OutResult extends IResult<unknown, unknown>>(
		callbackFunc: (value: IsOk extends true ? never : ErrType) => OutResult | Promise<OutResult>,
	): IsOk extends true ? this : Promise<OutResult>;
	/**
	 * Method to clone an result
	 * @returns {CloneType} - cloned result instance
	 * @example
	 * const x = Ok(2);
	 * const y = x.clone(); // Ok(2)
	 */
	clone(): IResultBuild<IsOk, OkType, ErrType>;

	/**
	 * Map the result value to a new value if Ok
	 * @param fn
	 * @example
	 * Ok<string, Error>('hello').map((v)=> Buffer.from(v)) // Ok<Buffer, Error>
	 * Err<Error, string>(new Error('broken')).map((v)=> Buffer.from(v)) // Err<Error, Buffer>
	 * @since v1.0.4
	 */
	map<NewOkType>(fn: (value: OkType) => NewOkType): IsOk extends true ? IOk<NewOkType> : this;

	/**
	 * Map the error value to a new value if Err
	 * @param fn - function to map the error value
	 * @returns {IErr<NewErrType>} new error result instance with mapped error
	 * @example
	 * const mapAsTypeErr = (err: Error): TypeError => new TypeError(`Mapped: ${err.message}`);
	 * Err<Error>(new Error('broken')).mapErr(mapAsTypeErr) // Err<TypeError>(new TypeError('Mapped: broken'))
	 * Ok<number>(2).mapErr(mapAsTypeErr); // Ok<number>(2)
	 * // error mapping and logging example
	 * const logErr = (err: Error) => console.error('Error:', err);
	 * Err<Error>(new Error('broken')).mapErr(mapAsTypeErr).inspectErr(logErr);
	 * @since v1.0.4
	 */
	mapErr<NewErrType>(fn: (value: ErrType) => NewErrType): IsOk extends true ? this : IErr<NewErrType>;

	/**
	 * Inspect the result value if Ok
	 * @deprecated use {@link inspectOk} instead as inspect might be overridden by NodeJS inspect setup.
	 * @param fn - function to inspect the value
	 * @returns {this} this result instance
	 * @example
	 * Ok<number>(2).inspect((value) => console.log('Value:', value)).unwrap() // logs 'Value: 2' and returns 2
	 * @since v1.0.8
	 */
	inspect(fn: (value: OkType) => void): this;

	/**
	 * Inspect the result value if Ok
	 * @param fn - function to inspect the value
	 * @returns {this} this result instance
	 * @example
	 * Ok<number>(2).inspectOk((value) => console.log('Value:', value)).unwrap() // logs 'Value: 2' and returns 2
	 * @since v2.0.3
	 */
	inspectOk(fn: (value: OkType) => void): this;

	/**
	 * Inspect the result value if Err
	 * @param fn - function to inspect the error
	 * @returns {this} this result instance
	 * @example
	 * Err<Error>(new Error('broken')).inspectErr((err) => console.error('Error:', err)).unwrap() // logs 'Error: Error('broken')' and throws
	 * @since v1.0.8
	 */
	inspectErr(fn: (value: ErrType) => void): this;

	/**
	 * Iterate over the result value
	 * @returns {IterableIterator<this>} iterable iterator of the result value
	 * @example
	 * Ok<number>(2).iter().next().value; // Ok<number>(2)
	 * Err<Error>(new Error('broken')).iter().next().done; // true (no values to iterate)
	 * @since v1.0.9
	 */
	iter(): IterableIterator<IsOk extends true ? ISome<OkType> : INone, IsOk extends true ? ISome<OkType> : INone>;

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
export type IResult<OkType = unknown, ErrType = unknown> = IErrBuilder<ErrType> | IOkBuilder<OkType>;

/**
 * Utility type for OkType or Result<OkType, ErrType>
 * @template OkType Type of the return value
 * @template ErrType Type of the error, default is unknown
 * @since v1.0.0
 */
export type IResultOrOkType<OkType, ErrType> = OkType | IResult<OkType, ErrType>;
