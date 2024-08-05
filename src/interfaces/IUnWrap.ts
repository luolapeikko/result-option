import {type ConstructorWithValueOf} from '../ValueOf.js';

export interface IUnWrap<ValueType, ErrorType> {
	/**
	 * Method to unwrap the value or throw an error
	 * @param {(err: ErrorType) => Error} err - optional function to transform the error
	 * @example
	 * Ok<number>(2).unwrap() // 2
	 * Err<number>(new Error('broken')).unwrap() // throws Error('broken')
	 * Some(2).unwrap() // 2
	 * None<number>().unwrap() // throws Error
	 */
	unwrap(err?: (err: ErrorType) => Error): ValueType;
	/**
	 * Method to unwrap the value or if error return the default value
	 * @param defaultValue - default value to return
	 */
	unwrapOr<DefaultType>(defaultValue: DefaultType): DefaultType | ValueType;
	/**
	 * Method to unwrap the value or if error return default value from function
	 * @param {() => DefaultType} callbackFunc - function to return default value
	 */
	unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType): DefaultType | ValueType;
	/**
	 * Method to unwrap the value or if error return default value from constructors valueOf
	 * @param constructorValueOf - constructor to return default value from valueOf
	 */
	unwrapOrValueOf(constructorValueOf: ConstructorWithValueOf<ValueType>): ValueType;
}
