import {type IOk, type IResult} from '../index.mjs';
import {type InferErrValue, type InferOkValue} from './types.mjs';

type Res = IResult<unknown, unknown>;
type LastElement<Arr extends Res[]> = Arr extends [...Res[], infer B] ? B : never;
type BuildOut<All extends IResult<any, any>, Last extends IResult<any, any>> = IResult<InferOkValue<Last>, InferErrValue<All> | InferErrValue<Last>>;
type Out<All extends Res[]> = BuildOut<All[number], LastElement<All>>;
type UnResultArgs<T extends Res[]> = {
	[K in keyof T]: T[K] extends IResult<infer Ok> ? Ok : T[K] extends IOk<infer Ok> ? Ok : never;
};
type Fn<I extends Res[], O extends Res> = (...args: UnResultArgs<I>) => O;

/**
 * Run a flow of results
 * @template A type of the initial result
 * @param {A} v initial result
 * @returns {IResult} as final result
 * @throws {Error} if uncontrolled error from callback
 * @example
 * const res: IResult<string> = Result.tupleFlow(
 *   Ok('hello'),
 *   (hello) => Ok(`${hello} world`),
 *   (hello, helloWorld) => Ok(helloWorld.length),
 *   (hello, helloWorld, length) => Ok(`${helloWorld}:${length.toString()}`),
 * );
 * @since v2.1.0
 */
export function resultTupleFlow<A extends Res>(v: A): A;
export function resultTupleFlow<A extends Res, B extends Res>(v: A, f0: Fn<[A], B>): Out<[A, B]>;
export function resultTupleFlow<A extends Res, B extends Res, C extends Res>(v: A, f0: Fn<[A], B>, f1: Fn<[A, B], C>): Out<[A, B, C]>;
export function resultTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res>(
	v: A,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
): Out<[A, B, C, D]>;
export function resultTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res>(
	v: A,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
): Out<[A, B, C, D, E]>;
export function resultTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res>(
	v: A,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
): Out<[A, B, C, D, E, F]>;
export function resultTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res>(
	v: A,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
): Out<[A, B, C, D, E, F, G]>;
export function resultTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res, H extends Res>(
	v: A,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
	f6: Fn<[A, B, C, D, E, F, G], H>,
): Out<[A, B, C, D, E, F, G, H]>;
export function resultTupleFlow<
	A extends Res,
	B extends Res,
	C extends Res,
	D extends Res,
	E extends Res,
	F extends Res,
	G extends Res,
	H extends Res,
	I extends Res,
>(
	v: A,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
	f6: Fn<[A, B, C, D, E, F, G], H>,
	f7: Fn<[A, B, C, D, E, F, G, H], I>,
): Out<[A, B, C, D, E, F, G, H, I]>;
export function resultTupleFlow<
	A extends Res,
	B extends Res,
	C extends Res,
	D extends Res,
	E extends Res,
	F extends Res,
	G extends Res,
	H extends Res,
	I extends Res,
	J extends Res,
>(
	v: A,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
	f6: Fn<[A, B, C, D, E, F, G], H>,
	f7: Fn<[A, B, C, D, E, F, G, H], I>,
	f8: Fn<[A, B, C, D, E, F, G, H, I], J>,
): Out<[A, B, C, D, E, F, G, H, I, J]>;
export function resultTupleFlow<
	A extends Res,
	B extends Res,
	C extends Res,
	D extends Res,
	E extends Res,
	F extends Res,
	G extends Res,
	H extends Res,
	I extends Res,
	J extends Res,
	K extends Res,
>(
	v: A,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
	f6: Fn<[A, B, C, D, E, F, G], H>,
	f7: Fn<[A, B, C, D, E, F, G, H], I>,
	f8: Fn<[A, B, C, D, E, F, G, H, I], J>,
	f9: Fn<[A, B, C, D, E, F, G, H, I, J], K>,
): Out<[A, B, C, D, E, F, G, H, I, J, K]>;
export function resultTupleFlow(val: Res, ...ops: Fn<Res[], Res>[]): IResult<unknown, unknown> {
	const resolvedArgs: unknown[] = [];
	return ops.reduce<IResult<unknown, unknown>>((acc, fn) => {
		return acc.andThen((res) => {
			try {
				resolvedArgs.push(res);
				acc = fn(...(resolvedArgs as unknown as Parameters<typeof fn>));
			} catch (cause) {
				if (cause instanceof Error) {
					throw new Error(`Fatal Uncontrolled error: ${cause.message}`, {cause});
				}
				throw new Error(`Fatal Uncontrolled error: ${JSON.stringify(cause)}`, {cause});
			}
			return acc;
		});
	}, val);
}
