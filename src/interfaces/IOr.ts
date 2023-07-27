/**
 * Interface for the Or method
 */
export interface IOr<BaseType, OutType extends BaseType> {
	/**
	 * or method , return either the self true value or the argument true value, otherwise if both are false values return the arguments false value
	 *
	 * @see https://doc.rust-lang.org/std/result/enum.Result.html#method.or
	 * @param {Result} value - compare value
	 * @returns {Result} - Result based on the self value and the value parameter
	 * @example
	 * Err<number>(new Error('broken')).or(Ok<number>(3)) // Ok<number>(3)
	 * Ok<number>(2).or(Err<number>(new Error('broken'))) // Ok<number>(2)
	 * Ok<number>(2).or(Ok<number>(3)) // Ok<number>(2)
	 */
	or<CompareType extends BaseType>(value: CompareType): OutType | CompareType;
}

export interface IOrElse<BaseType, ValueType extends BaseType, ErrType = void> {
	/**
	 * orElse method, return either the self when true value or run the callback function and return its result
	 * @param callbackFunc
	 * @example
	 * Ok<number, number>(2).orElse((errValue) => Ok(errValue * 2)) // Ok<number, number>(2)
	 * Err<number, number>(2).orElse((errValue) => Ok(errValue * 2)) // Ok<number, number>(4)
	 * Some<number>(2).orElse(() => Some(100)) // Some(2)
	 * None<number>().orElse(() => Some(100)) // Some(100)
	 */
	orElse<ElseType extends BaseType>(callbackFunc: (value: ErrType) => ElseType): ValueType | ElseType;
}
