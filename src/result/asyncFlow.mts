import {type ErrInstance, type IResult, type OkInstance} from '../index.mjs';

type Res = IResult<unknown, unknown>;
type LastElement<Arr extends Res[]> = Arr extends [...Res[], infer B] ? B : never;
type OnlyErrs<T> = T extends ErrInstance<infer E> ? E : never;
type ExtractOk<T> = T extends OkInstance<infer V> ? V : never;
type ExtractError<T> = T extends ErrInstance<infer E> ? E : never;
type BuildOut<All extends IResult<any, any>, Last extends IResult<any, any>> = IResult<ExtractOk<Last>, OnlyErrs<All> | ExtractError<Last>>;
type Out<All extends Res[]> = BuildOut<All[number], LastElement<All>>;

type Fn<I extends Res, O extends Res> = I extends OkInstance<infer V> ? (input: V) => O | Promise<O> : never;

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
export function resultAsyncFlow<A extends Res>(v: A): A | Promise<A>;
export function resultAsyncFlow<A extends Res, B extends Res>(v: A, f0: Fn<A, B>): Promise<Out<[A, B]>> | Out<[A, B]>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res>(v: A, f0: Fn<A, B>, f1: Fn<B, C>): Promise<Out<[A, B, C]>> | Out<[A, B, C]>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
): Promise<Out<[A, B, C, D]>> | Out<[A, B, C, D]>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
): Promise<Out<[A, B, C, D, E]>> | Out<[A, B, C, D, E]>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
): Promise<Out<[A, B, C, D, E, F]>> | Out<[A, B, C, D, E, F]>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
): Promise<Out<[A, B, C, D, E, F, G]>> | Out<[A, B, C, D, E, F, G]>;
export function resultAsyncFlow<A extends Res, B extends Res, C extends Res, D extends Res, E extends Res, F extends Res, G extends Res, H extends Res>(
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
	f6: Fn<G, H>,
): Promise<Out<[A, B, C, D, E, F, G, H]>> | Out<[A, B, C, D, E, F, G, H]>;
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
	v: A,
	f0: Fn<A, B>,
	f1: Fn<B, C>,
	f2: Fn<C, D>,
	f3: Fn<D, E>,
	f4: Fn<E, F>,
	f5: Fn<F, G>,
	f6: Fn<G, H>,
	f7: Fn<H, I>,
): Promise<Out<[A, B, C, D, E, F, G, H, I]>> | Out<[A, B, C, D, E, F, G, H, I]>;
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
): Promise<Out<[A, B, C, D, E, F, G, H, I, J]>> | Out<[A, B, C, D, E, F, G, H, I, J]>;
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
): Promise<Out<[A, B, C, D, E, F, G, H, I, J, K]>> | Out<[A, B, C, D, E, F, G, H, I, J, K]>;
export function resultAsyncFlow(val: Res, ...ops: Fn<Res, Res>[]): IResult<unknown, unknown> | Promise<IResult<unknown, unknown>> {
	if (ops.length === 0) {
		return val;
	}
	return ops.reduce<IResult<unknown, unknown> | Promise<IResult<unknown, unknown>>>(async (acc, op) => {
		const res = await acc;
		if (res.isErr) {
			return acc; // If any operation returns an error, propagate it
		}
		try {
			acc = await op(res.ok());
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
