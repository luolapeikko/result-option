import {type IAnd, type IAndThen, type IClone, type IEquals, type IOr, type IOrElse, type IResultMatch, type IUnWrap} from './index.js';
import {type INone, type IOption, type ISome} from '../option/index.js';

export interface IResultImplementation<OkType, ErrType>
	extends IUnWrap<OkType, ErrType>,
		IEquals<IResult>,
		IOr<IResult, IResult<OkType, ErrType>>,
		IOrElse<IResult, IResult<OkType, ErrType>, ErrType>,
		IAnd<IResult, IResult<OkType, ErrType>>,
		IClone<IResult<OkType, ErrType>>,
		IAndThen<OkType, IResult, IErr<OkType, ErrType>>,
		IResultMatch<OkType, ErrType> {
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
	 * Convert result to option and discard the error type
	 */
	toOption(): IOption<OkType>;

	/**
	 * Convert result to string
	 */
	toString(): `Ok(${string})` | `Err(${string})`;
}

export interface IOk<OkType, ErrType> extends Omit<IResultImplementation<OkType, ErrType>, 'isOk' | 'isErr' | 'ok' | 'err' | 'toOption' | 'toJSON'> {
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

	/**
	 * Convert result to option and discard the error type
	 */
	toOption(): ISome<OkType>;
}

export interface IErr<OkType, ErrType> extends Omit<IResultImplementation<OkType, ErrType>, 'isOk' | 'isErr' | 'ok' | 'err' | 'toJSON'> {
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

	/**
	 * Convert result to option and discard the error type
	 */
	toOption(): INone<OkType>;
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
export type IResult<OkType = unknown, ErrType = unknown> = IOk<OkType, ErrType> | IErr<OkType, ErrType>;

/**
 * Utility type for OkType or Result
 * @template OkType Type of the return value
 * @template ErrType Type of the error, default is unknown
 */
export type IResultOrOkType<OkType, ErrType> = OkType | IResult<OkType, ErrType>;
