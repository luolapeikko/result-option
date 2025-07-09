import {type IResult} from '../index.mjs';

/**
 * function to match the value or error
 * @template OkType - Ok type
 * @template ErrType - Err type
 * @template OkOutput - output type from Ok
 * @template ErrOutput - output type from Err
 * @param {IResult<OkType, ErrType>} result - result to match
 * @param {{Ok: (value: OkType) => OkOutput, Err: (err: ErrType) => ErrOutput}} solver - solver callback
 * @returns {OkOutput | ErrOutput} output
 * @example
 * matchResult(Ok<number>(2), {
 * 	Ok: (value) => value * 2,
 * 	Err: (err) => 0
 * }) // 4
 * matchResult(Err<number>(2), {
 * 	Ok: (value) => value * 2,
 * 	Err: (err) => 0
 * }) // 0
 */
export function matchResult<OkType, ErrType, OkOutput, ErrOutput>(
	result: IResult<OkType, ErrType>,
	solver: {
		Ok: (value: OkType) => OkOutput;
		Err: (err: ErrType) => ErrOutput;
	},
): OkOutput | ErrOutput {
	if (result.isOk) {
		return solver.Ok(result.ok());
	} else {
		return solver.Err(result.err());
	}
}
