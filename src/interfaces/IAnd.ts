/**
 * Interface for the And method
 */
export interface IAnd<BaseType, OutType extends BaseType> {
	/**
	 * and method, returns the second value if the result is true, otherwise returns the this error or the second error depending on the self value in that order
	 *
	 * @see https://doc.rust-lang.org/std/result/enum.Result.html#method.and
	 * @param {Result} value - compare value
	 * @returns {Result} - Result based on the self value and the value parameter
	 * @example
	 * Err<number>(new Error('broken')).and(Ok<number>(3)) // Err<number>(new Error('broken'))
	 * Ok<number>(2).and(Err<number>(new Error('broken'))) // Err<number>(new Error('broken'))
	 * Ok<number>(2).and(Ok<number>(3)) // Ok<number>(3)
	 */
	and<CompareType extends BaseType>(value: CompareType): OutType | CompareType;
}

export interface IAndThen<ValueType, ContainerType, FalseType extends ContainerType> {
	/**
	 * and then method, if true result use the value to build a new result, otherwise return the error
	 * @see https://doc.rust-lang.org/stable/std/result/enum.Result.html#method.and_then
	 * @param {(val: ValueType) => OutType} value - callback to build a new result
	 * @example
	 * Ok<number>(2).andThen((val) => Ok<number>(val + 1)) // Ok<number>(3)
	 * Err<number, string>('broken').andThen((val) => Ok<number, string>(val + 1)) // Err<number, string>('broken')
	 */
	andThen<OutType extends ContainerType>(value: (val: ValueType) => OutType): OutType | FalseType;
}
