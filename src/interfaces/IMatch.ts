export type ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput> = {
	Ok: (value: OkType) => OkOutput;
	Err: (err: ErrType) => ErrOutput;
};

export type OptionMatchSolver<SomeType, Output> = Map<SomeType, () => Output>;
