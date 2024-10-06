/**
 * Result Match callback interface
 * @since v0.6.4
 */
export type ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput> = {
	Ok: (value: OkType) => OkOutput;
	Err: (err: ErrType) => ErrOutput;
};

/**
 * Option Match callback interface
 * @since v0.6.4
 */
export type OptionMatchSolver<SomeType, Output> = Map<SomeType, () => Output>;
