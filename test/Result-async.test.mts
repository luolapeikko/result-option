import {describe, expect, it} from 'vitest';
import {AsyncResult, Err, IErr, IOk, type IResult, Ok, ResultError} from '../src/index.mjs';

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Result', function () {
	describe('Ok', function () {
		it('should resolve a value result from Ok Result', function () {
			const result = Ok(1);
			expect(result).toBeInstanceOf(IOk);
			expect(result.isOk).toBe(true);
			expect(result.isErr).toBe(false);
			expect(result.ok()).toBe(1);
			expect(result.err()).toBe(undefined);
		});
	});
	describe('Err', function () {
		it('should resolve a value result from Err Result', function () {
			const result = Err(1);
			expect(result).toBeInstanceOf(IErr);
			expect(result.isOk).toBe(false);
			expect(result.isErr).toBe(true);
			expect(result.ok()).toBe(undefined);
			expect(result.err()).toBe(1);
		});
	});
	describe('Async Integration', function () {
		it('should chain sync and async operations', async function () {
			const syncResultFn = (): IResult<number, Error> => Ok<number, Error>(10);
			const somePromiseResult = async (val: number) => Ok(val * 2);
			const processResult = (val: number) => Ok(val + 5);

			// Mixed chain
			const finalResult = await syncResultFn().andThen(somePromiseResult).andThen(processResult);

			expect(finalResult.isOk).toBe(true);
			expect(finalResult.ok()).toBe(25);
		});

		it('should handle errors in async chains', async function () {
			const syncResultFn = () => Ok(10);
			const somePromiseErr = async (_val: number) => {
				await sleep(10); // ensure async
				return Err<Error, number>(new Error('Async failure'));
			};
			const processResult = (val: number) => Ok(val + 5);

			const finalResult = await syncResultFn().andThen(somePromiseErr).andThen(processResult);

			expect(finalResult.isErr).toBe(true);
			expect(finalResult.err()).toBeInstanceOf(Error);
		});

		it('should support if (await ...isOk()) usage', async function () {
			const syncResultFn = () => Ok(true);
			const asyncOp = async (val: boolean) => Ok(!val);

			// The user expressed interest in if (await ...)
			// With our implementation, they can await the chain to get the Result,
			// or await .isOk() to get a boolean.

			const chain = syncResultFn().andThen(asyncOp);

			if (await chain.isOk) {
				const result = await chain;
				expect(result.ok()).toBe(false);
			} else {
				throw new Error('Should have been Ok');
			}
		});

		it('should support mapping inside AsyncResult', async function () {
			const result = Ok(10)
				.andThen(async (v) => Ok(v * 2))
				.map((v) => v + 5);

			expect(result).toBeInstanceOf(AsyncResult);
			expect((await result).ok()).toBe(25);
		});

		it('should access isErr on AsyncResult', async function () {
			const result = Ok(10).andThen(async (v) => Err(`error: ${v}`));
			expect(await result.isErr).toBe(true);
			expect(await result.isOk).toBe(false);
		});

		it('should access ok() and err() directly on AsyncResult', async function () {
			const okResult = Ok(42).andThen(async (v) => Ok(v * 2));
			expect(await okResult.ok()).toBe(84);
			expect(await okResult.err()).toBe(undefined);

			const errResult = Ok(42).andThen(async () => Err('failed'));
			expect(await errResult.ok()).toBe(undefined);
			expect(await errResult.err()).toBe('failed');
		});

		it('should skip map callback on AsyncResult with Err', async function () {
			let mapCalled = false;
			const result = Ok(10)
				.andThen(async () => Err('error'))
				.map(() => {
					mapCalled = true;
					return 999;
				});

			expect((await result).isErr).toBe(true);
			expect((await result).err()).toBe('error');
			expect(mapCalled).toBe(false);
		});

		it('should support isOkAnd on AsyncResult', async function () {
			const okRes = Ok(10).andThen(async (v) => Ok(v));
			const errRes = Ok(10).andThen(async () => Err('fail'));

			expect(await okRes.isOkAnd((v) => v === 10)).toBe(true);
			expect(await okRes.isOkAnd((v) => v === 20)).toBe(false);
			expect(await errRes.isOkAnd(() => true)).toBe(false);
		});

		it('should support isErrAnd on AsyncResult', async function () {
			const okRes = Ok(10).andThen(async (v) => Ok(v));
			const errRes = Ok(10).andThen(async () => Err('fail'));

			expect(await errRes.isErrAnd((e) => e === 'fail')).toBe(true);
			expect(await errRes.isErrAnd((e) => e === 'other')).toBe(false);
			expect(await okRes.isErrAnd(() => true)).toBe(false);
		});

		it('should support eq on AsyncResult', async function () {
			const res1 = Ok(10).andThen(async (v) => Ok(v));
			const res2 = Ok(10).andThen(async (v) => Ok(v));
			const res3 = Ok(20).andThen(async (v) => Ok(v));
			const resErr = Ok(10).andThen(async () => Err('fail'));

			expect(await res1.eq(await res2)).toBe(true);
			expect(await res1.eq(await res3)).toBe(false);
			expect(await res1.eq(await resErr)).toBe(false);
		});

		it('should support inspectOk on AsyncResult', async function () {
			let value: number | undefined;
			const res = Ok(10).andThen(async (v) => Ok(v));
			res.inspectOk((v) => {
				value = v;
			});
			await res;
			expect(value).toBe(10);

			let called = false;
			const errRes = Ok(10).andThen(async () => Err('fail'));
			errRes.inspectOk(() => {
				called = true;
			});
			await errRes;
			expect(called).toBe(false);
		});

		it('should support inspectErr on AsyncResult', async function () {
			let error: string | undefined;
			const res = Ok(10).andThen(async () => Err('fail'));
			res.inspectErr((e) => {
				error = e;
			});
			await res;
			expect(error).toBe('fail');

			let called = false;
			const okRes = Ok(10).andThen(async (v) => Ok(v));
			okRes.inspectErr(() => {
				called = true;
			});
			await okRes;
			expect(called).toBe(false);
		});

		it('should support mapErr on AsyncResult', async function () {
			const res = Ok(10)
				.andThen(async () => Err('fail'))
				.mapErr((e) => `mapped ${e}`);

			expect(await res.err()).toBe('mapped fail');

			const resAsync = Ok(10)
				.andThen(async () => Err('fail'))
				.mapErr(async (e) => `async mapped ${e}`);

			expect(await resAsync.err()).toBe('async mapped fail');

			const resOk = Ok(10)
				.andThen(async (v) => Ok(v))
				.mapErr((e) => `mapped ${e}`);
			expect(await resOk.ok()).toBe(10);
		});

		it('should support clone on AsyncResult', async function () {
			const res = Ok(10).andThen(async (v) => Ok(v));
			const cloned = res.clone();
			expect(cloned).toBeInstanceOf(AsyncResult);
			expect(await cloned.ok()).toBe(10);
		});
	});

	describe('OkInstance', function () {
		it('should chain sync andThen operations', function () {
			const result = Ok(10).andThen((v) => Ok(v * 2));
			expect(result).toBeInstanceOf(IOk);
			expect(result.isOk).toBe(true);
			expect(result.ok()).toBe(20);
		});

		it('should chain sync andThen with Err result', function () {
			const result = Ok(10).andThen(() => Err('sync error'));
			expect(result).toBeInstanceOf(IErr);
			expect(result.isErr).toBe(true);
			expect(result.err()).toBe('sync error');
		});

		it('should map values', function () {
			const result = Ok(10).map((v) => v.toString());
			expect(result.isOk).toBe(true);
			expect(result.ok()).toBe('10');
		});

		it('should always return false for isErrAnd', function () {
			expect(Ok(10).isErrAnd(() => true)).toBe(false);
		});

		it('should check equality', function () {
			expect(Ok(10).eq(Ok(10))).toBe(true);
			expect(Ok(10).eq(Ok(20))).toBe(false);
			expect(Ok(10).eq(Err('10'))).toBe(false);
		});

		it('should return original value for unwrapOr/OrElse/OrValueOf', function () {
			const res = Ok(10);
			expect(res.unwrapOr(20)).toBe(10);
			expect(res.unwrapOrElse(() => 20)).toBe(10);
			expect(res.unwrapOrValueOf(Number)).toBe(10);
		});

		it('should support and method', function () {
			expect(Ok(10).and(Ok(20)).ok()).toBe(20);
			expect(Ok(10).and(Err('fail')).err()).toBe('fail');
		});

		it('should support and method with promise', async function () {
			const result = Ok(10).and(Promise.resolve(Ok(20)));
			expect(result).toBeInstanceOf(AsyncResult);
			expect(await (await result).ok()).toBe(20);
		});

		it('should support or method', function () {
			expect(Ok(10).or(Ok(20)).ok()).toBe(10);
			expect(Ok(10).or(Err('fail')).ok()).toBe(10);
			expect(Err('fail').or(Ok(10)).ok()).toBe(10);
			expect(Err('fail').or(Err('fail2')).err()).toBe('fail2');
		});

		it('should support inspectOk and inspectErr on OkInstance', function () {
			let okVal: number | undefined;
			let errVal: string | undefined;
			const res = Ok(10);
			res.inspectOk((v) => {
				okVal = v;
			});
			res.inspectErr((e) => {
				errVal = e;
			});
			expect(okVal).toBe(10);
			expect(errVal).toBe(undefined);
		});

		it('should support clone and mapErr on OkInstance', function () {
			const res = Ok(10);
			const cloned = res.clone();
			expect(cloned).not.toBe(res);
			expect(cloned.ok()).toBe(10);

			expect(res.mapErr(() => 'error')).toBe(res);
		});
	});

	describe('ErrInstance', function () {
		it('should skip andThen callback on Err', async function () {
			let callbackCalled = false;
			const result = await Err('initial error').andThen(() => {
				callbackCalled = true;
				return Ok(999);
			});
			expect(result.isErr).toBe(true);
			expect(result.err()).toBe('initial error');
			expect(callbackCalled).toBe(false);
		});

		it('should skip map callback on Err', function () {
			let callbackCalled = false;
			const result = Err('error').map(() => {
				callbackCalled = true;
				return 999;
			});
			expect(result.isErr).toBe(true);
			expect(result.err()).toBe('error');
			expect(callbackCalled).toBe(false);
		});

		it('should recover from Err using orElse (sync)', function () {
			const result = Err('failed').orElse((err) => Ok(`recovered from ${err}`));
			expect(result.isOk).toBe(true);
			expect(result.ok()).toBe('recovered from failed');
		});

		it('should recover from Err using orElse (async)', async function () {
			const result = await Err('failed').orElse(async (err) => Ok(`recovered from ${err}`));
			expect(result.isOk).toBe(true);
			expect(result.ok()).toBe('recovered from failed');
		});

		it('should fail to recover from Err using orElse', function () {
			const result = Err('failed').orElse((err) => Err(`${err} again`));
			expect(result.isErr).toBe(true);
			expect(result.err()).toBe('failed again');
		});

		it('should always return false for isOkAnd', function () {
			expect(Err('fail').isOkAnd(() => true)).toBe(false);
		});

		it('should apply callback for isErrAnd', function () {
			expect(Err('fail').isErrAnd((e) => e === 'fail')).toBe(true);
			expect(Err('fail').isErrAnd((e) => e === 'other')).toBe(false);
		});

		it('should check equality', function () {
			expect(Err('fail').eq(Err('fail'))).toBe(true);
			expect(Err('fail').eq(Err('other'))).toBe(false);
			expect(Err('fail').eq(Ok('fail'))).toBe(false);
		});

		it('should skip map and andThen callbacks', async function () {
			let called = false;
			const res = Err('fail');

			expect(
				res.map(() => {
					called = true;
					return 1;
				}),
			).toBe(res);
			expect(called).toBe(false);

			expect(
				res.andThen(() => {
					called = true;
					return Ok(1);
				}),
			).toBe(res);
			expect(called).toBe(false);

			const asyncRes = await res.andThen(async () => {
				await sleep(0);
				called = true;
				return Ok(1);
			});
			expect(asyncRes).toBe(res);
			expect(called).toBe(false);
		});

		it('should support and method', function () {
			const res = Err('fail');
			expect(res.and(Ok(10))).toBe(res);
			expect(res.and(Err('other'))).toBe(res);
		});

		it('should support or method', function () {
			expect(Err('fail').or(Ok(10)).ok()).toBe(10);
			expect(Err('fail').or(Err('other')).err()).toBe('other');
		});

		it('should support inspectOk and inspectErr on ErrInstance', function () {
			let okVal: number | undefined;
			let errVal: string | undefined;
			const res = Err('fail');
			res.inspectOk((v) => {
				okVal = v;
			});
			res.inspectErr((e) => {
				errVal = e;
			});
			expect(okVal).toBe(undefined);
			expect(errVal).toBe('fail');
		});

		it('should support clone and mapErr on ErrInstance', function () {
			const res = Err('fail');
			const cloned = res.clone();
			expect(cloned).not.toBe(res);
			expect(cloned.err()).toBe('fail');

			const mapped = res.mapErr((e) => `mapped ${e}`);
			expect(mapped.err()).toBe('mapped fail');
		});
		it('should support or method with promise', async function () {
			const result = Err('fail').or(Promise.resolve(Ok(10)));
			expect(result).toBeInstanceOf(AsyncResult);
			expect(await (await result).ok()).toBe(10);
		});
	});

	describe('orElse', function () {
		it('should skip orElse on OkInstance', function () {
			let called = false;
			const result = Ok(10).orElse(() => {
				called = true;
				return Ok(20);
			});
			const awaited = result;
			expect(awaited.isOk).toBe(true);
			expect(awaited.ok()).toBe(10);
			expect(called).toBe(false);
		});

		it('should support complex async recovery chain', async function () {
			const result = Err('start')
				.orElse(async (e) => Err(`${e}->err1`))
				.orElse((e) => Err(`${e}->err2`))
				.orElse(async (e) => Ok(`${e}->ok`));

			expect(result).toBeInstanceOf(AsyncResult);
			const final_res = await result;
			expect(final_res.isOk).toBe(true);
			expect(final_res.ok()).toBe('start->err1->err2->ok');
		});

		it('should skip orElse callback on AsyncResult wrapping Ok', async function () {
			let called = false;
			const res = Ok(1)
				.andThen(async (v) => Ok(v))
				.orElse(() => {
					called = true;
					return Ok(2);
				});

			expect(await res.ok()).toBe(1);
			expect(called).toBe(false);
		});

		it('should support and method on AsyncResult', async function () {
			const ok1 = Ok(1).andThen(async (v) => Ok(v));
			const ok2 = Ok(2).andThen(async (v) => Ok(v));
			const err = Ok(1).andThen(async () => Err('fail'));

			expect(await (await ok1.and(ok2)).ok()).toBe(2);
			expect(await (await ok1.and(err)).err()).toBe('fail');
			expect(await (await err.and(ok2)).err()).toBe('fail');
		});

		it('should support or method on AsyncResult', async function () {
			const ok1 = Ok(1).andThen(async (v) => Ok(v));
			const ok2 = Ok(2).andThen(async (v) => Ok(v));
			const err1 = Ok(1).andThen(async () => Err('fail1'));
			const err2 = Ok(1).andThen(async () => Err('fail2'));

			expect(await (await ok1.or(ok2)).ok()).toBe(1);
			expect(await (await ok1.or(err1)).ok()).toBe(1);
			expect(await (await err1.or(ok2)).ok()).toBe(2);
			expect(await (await err1.or(err2)).err()).toBe('fail2');
		});

		it('should support unwrapOr on AsyncResult', async function () {
			const okRes = Ok(1).andThen(async (v) => Ok(v));
			const errRes = Ok(1).andThen(async () => Err('fail'));

			expect(await okRes.unwrapOr(2)).toBe(1);
			expect(await errRes.unwrapOr(2)).toBe(2);
		});

		it('should support unwrapOrElse on AsyncResult', async function () {
			const okRes = Ok(1).andThen(async (v) => Ok(v));
			const errRes = Ok(1).andThen(async () => Err('fail'));

			expect(await okRes.unwrapOrElse(() => 2)).toBe(1);
			expect(await errRes.unwrapOrElse((e) => `recovered ${e}`)).toBe('recovered fail');
		});

		it('should support unwrapOrValueOf on AsyncResult', async function () {
			const okRes = Ok(1).andThen(async (v) => Ok(v));
			const errRes = Ok(1).andThen(async () => Err('fail'));

			expect(await okRes.unwrapOrValueOf(Number)).toBe(1);
			expect(await errRes.unwrapOrValueOf(Number)).toBe(0);
		});
	});

	describe('unwrap', function () {
		it('should unwrap Ok value', function () {
			expect(Ok(1).unwrap()).toBe(1);
		});

		it('should throw Err value on unwrap', function () {
			expect(() => Err('failure').unwrap()).toThrow('failure');
		});

		it('should throw ResultError when unwrapping an Error', function () {
			const err = new Error('fail');
			expect(() => Err(err).unwrap()).toThrow(new ResultError(err));
		});

		it('should unwrap AsyncResult Ok value', async function () {
			const res = Ok(1).andThen(async (v) => Ok(v));
			expect(await res.unwrap()).toBe(1);
		});

		it('should throw AsyncResult Err value on unwrap', async function () {
			const res = Ok(1).andThen(async () => Err('async failure'));
			await expect(res.unwrap()).rejects.toBe('async failure');
		});
		it('should throw AsyncResult Err value on unwrap', async function () {
			const res = Ok(1).andThen(async () => Err(new Error('async failure')));
			await expect(res.unwrap()).rejects.toThrow(new ResultError(new Error('async failure')));
		});

		it('should support unwrapOr on sync Result', function () {
			expect(Ok(1).unwrapOr(2)).toBe(1);
			expect(Err('fail').unwrapOr(2)).toBe(2);
		});

		it('should support unwrapOrElse on sync Result', function () {
			expect(Ok(1).unwrapOrElse(() => 2)).toBe(1);
			expect(Err('fail').unwrapOrElse((e) => `recovered ${e}`)).toBe('recovered fail');
		});

		it('should support unwrapOrValueOf on sync Result', function () {
			expect(Ok(1).unwrapOrValueOf(Number)).toBe(1);
			expect(Err('fail').unwrapOrValueOf(Number)).toBe(0);
		});
	});
});
