import {IAnd, IAndThen} from './interfaces/IAnd';
import {IClone} from './interfaces/IClone';
import {IEquals} from './interfaces/IEquals';
import {IOr, IOrElse} from './interfaces/IOr';
import {IUnWrap} from './interfaces/IUnWrap';
import {Option} from './Option';

export interface IResultImplementation<OkType, ErrType>
	extends IUnWrap<OkType, ErrType>,
		IEquals<Result>,
		IOr<Result, Result<OkType, ErrType>>,
		IOrElse<Result, Result<OkType, ErrType>, ErrType>,
		IAnd<Result, Result<OkType, ErrType>>,
		IClone<Result<OkType, ErrType>>,
		IAndThen<OkType, Result, IErr<OkType, ErrType>> {
	/**
	 * Try to get value, otherwise return undefined
	 * @returns {OkType | undefined} value or undefined
	 * @example
	 * Ok<number>(2).ok() // 2
	 * Err<number>(new Error('broken')).ok() // undefined
	 */
	ok(): OkType | undefined;
	/**
	 * Check that result is not an error
	 * @returns {boolean} true if result is not an error
	 * @example
	 * Ok<number>(2).isOk // true
	 * Err<number>(new Error('broken')).isOk // false
	 */
	isOk: boolean;
	/**
	 * Try to get the error, otherwise return undefined
	 * @returns {ErrType | undefined} error or undefined
	 * @example
	 * Ok<number>(2).err() // undefined
	 * Err<number>(new Error('broken')).err() // Error('broken')
	 */
	err(): ErrType | undefined;
	/**
	 * Check that result is an error
	 * @returns {boolean} true if result is an error
	 * @example
	 * Ok<number>(2).isErr // false
	 * Err<number>(new Error('broken')).isErr // true
	 */
	isErr: boolean;

	/**
	 * Solve the result with the given solver
	 * @template Output Type of the output
	 * @param solver solver to use
	 * @returns {Output} returns the output of the solver
	 * @example
	 * const res: Result<string, Error> = Ok<string, Error>('hello');
	 * const data: string = res.match({
	 *   Ok: (value) => `${value} world`,
	 *   Err: (err) => `${err.message} world`,
	 * });
	 */
	match<Output>(solver: {Ok: (value: OkType) => Output; Err: (err: ErrType) => Output}): Output;

	/**
	 * Convert result to option and discard the error type
	 */
	toOption(): Option<OkType>;
}

export interface IOk<OkType, ErrType> extends Omit<IResultImplementation<OkType, ErrType>, 'isOk' | 'isErr' | 'ok' | 'err'> {
	/**
	 * Check that result is not an error
	 * @returns {boolean} true if result is not an error
	 * @example
	 * Ok<number>(2).isOk // true
	 */
	isOk: true;
	/**
	 * Try to get value, otherwise return undefined
	 * @returns {OkType | undefined} value or undefined
	 * @example
	 * Ok<number>(2).ok() // 2
	 */
	ok(): OkType;
	/**
	 * Check that result is an error
	 * @returns {boolean} true if result is an error
	 * @example
	 * Ok<number>(2).isErr // false
	 */
	isErr: false;
	/**
	 * Try to get the error, otherwise return undefined
	 * @returns {ErrType | undefined} error or undefined
	 * @example
	 * Ok<number>(2).err() // undefined
	 */
	err(): undefined;
}

export interface IErr<OkType, ErrType> extends Omit<IResultImplementation<OkType, ErrType>, 'isOk' | 'isErr' | 'ok' | 'err'> {
	/**
	 * Check that result is not an error
	 * @returns {boolean} true if result is not an error
	 * @example
	 * Err<number>(new Error('broken')).isOk // false
	 */
	isOk: false;
	/**
	 * Try to get value, otherwise return undefined
	 * @returns {OkType | undefined} value or undefined
	 * @example
	 * Err<number>(new Error('broken')).ok() // undefined
	 */
	ok(): undefined;
	/**
	 * Check that result is an error
	 * @returns {boolean} true if result is an error
	 * @example
	 * Err<number>(new Error('broken')).isErr // true
	 */
	isErr: true;
	/**
	 * Try to get the error, otherwise return undefined
	 * @returns {ErrType | undefined} error or undefined
	 * @example
	 * Err<number>(new Error('broken')).err() // Error('broken')
	 */
	err(): ErrType;
}

/**
 * Result type, this type contains types for both Ok and Err
 * @template OkType Type of the return value, default is unknown
 * @template ErrType Type of the error, default is unknown
 * @example
 * async function action(): Promise<Result<number>> {
 *   try {
 *     return Ok<number>(await getNumber());
 *   } catch (e) {
 *     return Err<number>(e);
 *   }
 * }
 * const result = await action();
 * if (result.isOk) {
 *   console.log('Result: ' + result.ok());
 * } else {
 *   console.log('Error: ', result.err());
 * }
 */
export type Result<OkType = unknown, ErrType = unknown> = IOk<OkType, ErrType> | IErr<OkType, ErrType>;

/**
 * Utility type for OkType or Result
 * @template OkType Type of the return value
 * @template ErrType Type of the error, default is unknown
 */
export type ResultOrOkType<OkType, ErrType> = OkType | Result<OkType, ErrType>;
