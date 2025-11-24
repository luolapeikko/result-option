import {type IOk, type IResult} from '../index.mjs';
import {type InferErrValue, type InferOkValue} from './types.mjs';

type Res = IResult<unknown, unknown>;
type LastElement<Arr extends Res[]> = Arr extends [...Res[], infer B] ? B : never;
type BuildOut<All extends IResult<any, any>, Last extends IResult<any, any>> = IResult<InferOkValue<Last>, InferErrValue<All> | InferErrValue<Last>>;
type Out<All extends Res[]> = BuildOut<All[number], LastElement<All>>;
type UnResultArgs<T extends Res[]> = {
	[K in keyof T]: T[K] extends IOk<infer Ok> ? Ok : never;
};
type Fn<I extends Res[], O extends Res> = (...args: UnResultArgs<I>) => O | Promise<O>;

/**
 * Run a async flow of results
 * @template A type of the initial result
 * @param {A} v initial result
 * @returns {IResult} as final result
 * @throws {Error} if uncontrolled error from callback
 * @example
 * const res: Promise<IResult<string>> = Result.asyncTupleFlow(
 *   Ok('hello'),
 *   (hello) => Promise.resolve(Ok(`${hello} world`)),
 *   (hello, helloWorld) => Ok(helloWorld.length),
 *   (hello, helloWorld, length) => Ok(`${helloWorld}:${length.toString()}`),
 * );
 * @since v2.1.0
 */
export function resultAsyncTupleFlow<A extends Res>(v: A | Promise<A>): Promise<A>;
export function resultAsyncTupleFlow<A extends Res, B extends Res>(v: A | Promise<A>, f0: Fn<[A], B>): Promise<Out<[A, B]>>;
export function resultAsyncTupleFlow<A extends Res, B extends Res, C extends Res>(
	v: A | Promise<A>,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
): Promise<Out<[A, B, C]>>;
export function resultAsyncTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res>(
	v: A | Promise<A>,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
): Promise<Out<[A, B, C, D]>>;
export function resultAsyncTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res>(
	v: A | Promise<A>,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
): Promise<Out<[A, B, C, D, E]>>;
export function resultAsyncTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res>(
	v: A | Promise<A>,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
): Promise<Out<[A, B, C, D, E, F]>>;
export function resultAsyncTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res>(
	v: A | Promise<A>,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
): Promise<Out<[A, B, C, D, E, F, G]>>;
export function resultAsyncTupleFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res, H extends Res>(
	v: A | Promise<A>,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
	f6: Fn<[A, B, C, D, E, F, G], H>,
): Promise<Out<[A, B, C, D, E, F, G, H]>>;
export function resultAsyncTupleFlow<
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
	v: A | Promise<A>,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
	f6: Fn<[A, B, C, D, E, F, G], H>,
	f7: Fn<[A, B, C, D, E, F, G, H], I>,
): Promise<Out<[A, B, C, D, E, F, G, H, I]>>;
export function resultAsyncTupleFlow<
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
	v: A | Promise<A>,
	f0: Fn<[A], B>,
	f1: Fn<[A, B], C>,
	f2: Fn<[A, B, C], D>,
	f3: Fn<[A, B, C, D], E>,
	f4: Fn<[A, B, C, D, E], F>,
	f5: Fn<[A, B, C, D, E, F], G>,
	f6: Fn<[A, B, C, D, E, F, G], H>,
	f7: Fn<[A, B, C, D, E, F, G, H], I>,
	f8: Fn<[A, B, C, D, E, F, G, H, I], J>,
): Promise<Out<[A, B, C, D, E, F, G, H, I, J]>>;
export function resultAsyncTupleFlow<
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
	v: A | Promise<A>,
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
): Promise<Out<[A, B, C, D, E, F, G, H, I, J, K]>>;
export function resultAsyncTupleFlow(val: Res | Promise<Res>, ...ops: Fn<Res[], Res>[]): IResult<unknown, unknown> | Promise<IResult<unknown, unknown>> {
	const resolvedArgs: unknown[] = [];
	return ops.reduce<IResult<unknown, unknown> | Promise<IResult<unknown, unknown>>>(async (acc, fn) => {
		return (await acc).andThenPromise(async (res) => {
			try {
				resolvedArgs.push(res);
				acc = await fn(...(resolvedArgs as unknown as Parameters<typeof fn>));
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
