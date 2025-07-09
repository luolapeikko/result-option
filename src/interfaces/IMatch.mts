/**
 * Option Match callback interface
 * @since v0.6.4
 */
export type OptionMatchSolver<SomeType, Output> = Map<SomeType, () => Output>;
