import {type IOk, type IResult} from '../index.mjs';
import {type InferErrValue, type InferOkValue} from './types.mjs';

type Res = IResult<unknown, unknown>;
type LastElement<Arr extends Res[]> = Arr extends [...Res[], infer B] ? B : never;
type BuildOut<All extends IResult<any, any>, Last extends IResult<any, any>> = IResult<InferOkValue<Last>, InferErrValue<All> | InferErrValue<Last>>;
type Out<All extends Res[]> = BuildOut<All[number], LastElement<All>>;

type Fn<I extends Res, O extends Res> = I extends IOk<infer V> ? (input: V) => O : never;

/**
 * Run a flow of results
 * @template A type of the initial result
 * @param {A} v initial result
 * @returns {IResult} as final result
 * @throws {Error} if uncontrolled error from callback
 * @example
 * const res: IResult<string> = resultFlow(
 *   Ok('hello'),
 *   (value) => Ok(`${value} world`),
 *   (value) => Ok(value.length),
 *   (value) => Ok(value.toString()),
 * );
 * @since v1.2.1
 */
export function resultFlow<A extends Res>(v: A): A;
export function resultFlow<A extends Res, B extends Res>(v: A, f0: Fn<A, B>): Out<[A, B]>;
export function resultFlow<A extends Res, B extends Res, C extends Res>(v: A, f0: Fn<A, B>, f1: Fn<B, C>): Out<[A, B, C]>;
export function resultFlow<A extends Res, B extends Res, C extends Res, D extends Res>(v: A, f0: Fn<A, B>, f1: Fn<B, C>, f2: Fn<C, D>): Out<[A, B, C, D]>;
export function resultFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
): Out<[A, B, C, D, E]>;
export function resultFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
): Out<[A, B, C, D, E, F]>;
export function resultFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
): Out<[A, B, C, D, E, F, G]>;
export function resultFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res, H extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
	f6: Fn<G, H>,
): Out<[A, B, C, D, E, F, G, H]>;
export function resultFlow<
	A extends Res,
	B extends Res,
	C extends Res,
	D extends Res,
	E extends Res,
	F extends Res,
	G extends Res,
	H extends Res,
	I extends Res,
>(v: A, f0: Fn<A, B>, f1: Fn<B, C>, f2: Fn<C, D>, f3: Fn<D, E>, f4: Fn<E, F>, f5: Fn<F, G>, f6: Fn<G, H>, f7: Fn<H, I>): Out<[A, B, C, D, E, F, G, H, I]>;
export function resultFlow<
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
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
	f6: Fn<G, H>,
	f7: Fn<H, I>,
	f8: Fn<I, J>,
): Out<[A, B, C, D, E, F, G, H, I, J]>;
export function resultFlow<
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
): Out<[A, B, C, D, E, F, G, H, I, J, K]>;
export function resultFlow(val: Res, ...ops: Fn<Res, Res>[]): IResult<unknown, unknown> {
	return ops.reduce<IResult<unknown, unknown>>((acc, fn) => {
		if (acc.isErr) {
			return acc; // If any operation returns an error, propagate it
		}
		try {
			acc = fn(acc.ok());
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
