import {type IOk, type IResult} from '../index.mjs';
import {type InferErrValue, type InferOkValue} from './types.mjs';

type Res = IResult<unknown, unknown>;
type LastElement<Arr extends Res[]> = Arr extends [...Res[], infer B] ? B : never;
type BuildOut<All extends IResult<any, any>, Last extends IResult<any, any>> = IResult<InferOkValue<Last>, InferErrValue<All> | InferErrValue<Last>>;
type Out<All extends Res[]> = BuildOut<All[number], LastElement<All>>;

type Fn<I extends Res, O extends Res> = I extends IOk<infer V> ? (input: V) => O | Promise<O> : never;

/**
 * Run a flow of results
 * @template A type of the initial result
 * @param {A} v initial result
 * @returns {IResult} as final result
 * @throws {Error} if uncontrolled error from callback
 * @example
 * const res: Promise<IResult<string>> = resultAsyncFlow(
 *   Ok('hello'),
 *   (value) => Ok(`${value} world`),
 *   (value) => Ok(value.length),
 *   (value) => Ok(value.toString()),
 * );
 * @since v1.2.1
 */
export function resultAsyncFlow<A extends Res>(v: A | Promise<A>): Promise<A>;
export function resultAsyncFlow<A extends Res, B extends Res>(v: A | Promise<A>, f0: Fn<A, B>): Promise<Out<[A, B]>>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res>(v: A | Promise<A>, f0: Fn<A, B>, f1: Fn<B, C>): Promise<Out<[A, B, C]>>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res>(
	v: A | Promise<A>,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
): Promise<Out<[A, B, C, D]>>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res>(
	v: A | Promise<A>,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
): Promise<Out<[A, B, C, D, E]>>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res>(
	v: A | Promise<A>,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
): Promise<Out<[A, B, C, D, E, F]>>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res>(
	v: A | Promise<A>,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
): Promise<Out<[A, B, C, D, E, F, G]>>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res, H extends Res>(
	v: A | Promise<A>,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
	f6: Fn<G, H>,
): Promise<Out<[A, B, C, D, E, F, G, H]>>;
export function resultAsyncFlow<
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
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
	f6: Fn<G, H>,
	f7: Fn<H, I>,
): Promise<Out<[A, B, C, D, E, F, G, H, I]>>;
export function resultAsyncFlow<
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
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
	f6: Fn<G, H>,
	f7: Fn<H, I>,
	f8: Fn<I, J>,
): Promise<Out<[A, B, C, D, E, F, G, H, I, J]>>;
export function resultAsyncFlow<
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
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
	f6: Fn<G, H>,
	f7: Fn<H, I>,
	f8: Fn<I, J>,
	f9: Fn<J, K>,
): Promise<Out<[A, B, C, D, E, F, G, H, I, J, K]>>;
export function resultAsyncFlow(val: Res | Promise<Res>, ...ops: Fn<Res, Res>[]): IResult<unknown, unknown> | Promise<IResult<unknown, unknown>> {
	return ops.reduce<IResult<unknown, unknown> | Promise<IResult<unknown, unknown>>>(async (acc, fn) => {
		const res = await acc;
		if (res.isErr) {
			return acc; // If any operation returns an error, propagate it
		}
		try {
			acc = await fn(res.ok());
		} catch (e) {
			if (e instanceof Error) {
				e.message = `Fatal Uncontrolled error: ${e.message}`;
				throw e;
			}
			throw new Error(`Fatal Uncontrolled error: ${JSON.stringify(e)}`);
		}
		return acc;
	}, val);
}
