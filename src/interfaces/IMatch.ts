export type ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput> = {
	Ok: (value: OkType) => OkOutput;
	Err: (err: ErrType) => ErrOutput;
};

export interface IResultMatch<OkType, ErrType> {
	/**
	 * Match the value or error
	 * @template OkOutput type of the Ok output
	 * @template ErrOutput type of the Err output
	 * @param {ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput>} solver - solver
	 * @returns {OkOutput | ErrOutput} output
	 * @example
	 * Ok<number>(2).match({
	 * 	Ok: (value) => value * 2,
	 * 	Err: (err) => 0
	 * }) // 4
	 */
	match<OkOutput, ErrOutput>(solver: ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput>): OkOutput | ErrOutput;
}

export type OptionMatchSolver<SomeType, Output> = Map<SomeType, () => Output>;

export interface IOptionMatch<SomeType> {
	/**
	 * match executes the given function if the option is a Some value, otherwise returns the default value.
	 * @template Output type of the result
	 * @param solver map of functions to execute
	 * @param defaultValue optional default value
	 * @returns {Output | undefined} the result of the executed function or the default value
	 * @example
	 * const output: string = Some(1).match(
	 *   new Map([
	 *     [1, () => 'one'],
	 *     [2, () => 'two'],
	 *   ]),
	 *   'other',
	 * );
	 */
	match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue: Output): Output;
	match<Output>(solver: OptionMatchSolver<SomeType, Output>): Output | undefined;
}
