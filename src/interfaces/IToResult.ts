import {type IResult} from '../result/index.js';

export interface IToResult<ValueType> {
	/**
	 * Method to convert as Result
	 * @param err Result Error type if conversion fails.
	 * @returns {IResult<SomeType, ErrType>} Result
	 */
	toResult<ErrType>(err: ErrType): IResult<ValueType, ErrType>;
}
