type Exact<A, B> = (<T>() => T extends A ? 1 : 0) extends <T>() => T extends B ? 1 : 0 ? (A extends B ? (B extends A ? unknown : never) : never) : never;

/** Fails when `actual` and `expected` have different types. */
export const exactType: <Actual, Expected>(actual: Actual & Exact<Actual, Expected>, expected: Expected & Exact<Actual, Expected>) => Expected = (
	_actual,
	_expected,
) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return null as any;
};
