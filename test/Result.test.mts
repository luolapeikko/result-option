import {describe, expect, it} from 'vitest';
import {Err, fromJsonResult, IErr, type IOk, type IResult, None, Ok, Result, Some} from '../src/index.mjs';

const stE = new Error('oops');

const ok1 = Result.from<number, Error>(Ok(1));
const ok2 = Result.from<string, Error>(Ok('2'));
const ok3 = Result.from<Date, Error>(Ok(new Date(0)));
const err1 = Result.from<Date, Error>(Err(new Error('broken')));

const testFunction = Result.wrapFn((value: string) => {
	if (value === 'error') {
		throw stE;
	}
	return value;
});

const testAsyncFunction = Result.wrapAsyncFn((value: string) => {
	if (value === 'error') {
		return Promise.reject(stE);
	}
	return Promise.resolve(value);
});

type Output = string | number | boolean;
type IStoreProcessor<T> = (input: Output) => T;

const processorResult: IResult<IStoreProcessor<Output> | undefined, Error> = Ok<IStoreProcessor<Output> | undefined, Error>(undefined);

export function typeTesting(data: Output): IResult<Output | undefined, Error> {
	if (processorResult.isErr) {
		return processorResult;
	}
	const privateProcessor = processorResult.ok();
	if (!privateProcessor) {
		return Err(new Error('Processor not found'));
	}
	return Ok(privateProcessor(data));
}

describe('FunctionResult', function () {
	describe('Ok', function () {
		it('should resolve a value result from Ok Result', function () {
			const value = 'hello' as string;
			let inspectValue: string | undefined;
			let inspectErrValue: Error | undefined;
			const result = Ok<string, Error>(value)
				.inspectOk((value) => (inspectValue = value))
				.inspectErr((value) => (inspectErrValue = value)) as IResult<string, Error>;
			expect(inspectValue).to.be.equal(value);
			expect(inspectErrValue).to.be.equal(undefined);
			expect(result.isOk).to.be.eq(true);
			expect(result.isErr).to.be.eq(false);
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
			// Ok and Err type validation
			if (result.isOk) {
				const okResult: string = result.ok();
				expect(okResult).to.be.equal(value);
			} else {
				const errResult: Error = result.err();
				expect(errResult).to.be.equal(undefined);
			}
		});

		it('should resolve with safeResultBuilder function', function () {
			const value = 'hello';
			const result: IResult<string> = testFunction(value);
			expect(result.isOk).to.be.eq(true);
			expect(result.isErr).to.be.eq(false);
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});

		it('should resolve with safeAsyncResultBuilder function', async function () {
			const value = 'hello';
			const result: IResult<string> = await testAsyncFunction(value);
			expect(result.isOk).to.be.eq(true);
			expect(result.isErr).to.be.eq(false);
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});

		it('should resolve with dual safeResult chain', function () {
			const value = 'hello';
			const callback = Result.wrapFn((v: string) => testFunction(v));
			const result: IResult<string> = callback(value);
			expect(result.isOk).to.be.eq(true);
			expect(result.isErr).to.be.eq(false);
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});

		it('should resolve with dual safeAsyncResult chain', async function () {
			const value = 'hello';
			const callback = Result.wrapAsyncFn((v: string) => testAsyncFunction(v));
			const result: IResult<string> = await callback(value);
			expect(result.isOk).to.be.eq(true);
			expect(result.isErr).to.be.eq(false);
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});

		it('should resolve with dual safeAsyncResult chain', async function () {
			const value = 'hello';
			const callback = Result.wrapAsyncFn((v: string) => testFunction(v) as unknown as Promise<IResult<string>>);
			const result: IResult<string> = await callback(value);
			expect(result.isOk).to.be.eq(true);
			expect(result.isErr).to.be.eq(false);
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});
		it('should test isOkAnd and isErrAnd', function () {
			expect(Ok(1).isOkAnd((v) => v === 1)).to.be.eq(true);
			expect(Ok(1).isErrAnd((v) => v === 1)).to.be.eq(false);
			expect(Err(1).isErrAnd((v) => v === 1)).to.be.eq(true);
			expect(Err(1).isOkAnd((v) => v === 1)).to.be.eq(false);
		});
		it('should test Ok void', function () {
			const res: IOk<void> = Ok();
			expect(res.isOk).to.be.eq(true);
			expect(res.isErr).to.be.eq(false);
			expect(res.ok()).to.be.equal(undefined);
			expect(res.err()).to.be.equal(undefined);
			expect(res.unwrap()).to.be.equal(undefined);
			expect(res.unwrapOr('world')).to.be.equal(undefined);
		});
	});
	describe('Err', function () {
		it('should create a error result from Err', function () {
			const demoError = new Error('demo');
			let inspectValue: string | undefined;
			let inspectErrValue: Error | undefined;
			const result = Err(Err(stE)) // chaining Err
				.inspect((value) => (inspectValue = value))
				.inspectErr((value) => (inspectErrValue = value));
			const iter = result.iter();
			expect(inspectValue).to.be.equal(undefined);
			expect(inspectErrValue).to.be.equal(stE);
			expect(result.isOk).to.be.eq(false);
			expect(result.isErr).to.be.eq(true);
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(() => result.mapErr(() => demoError).unwrap()).to.throw(demoError);
			expect(result.unwrapOr('world')).to.be.equal('world');
			expect(result.unwrapOrElse(() => 'world')).to.be.equal('world');
			expect(result.unwrapOrValueOf(String)).to.be.equal('');
			let exception: unknown;
			try {
				result.unwrap();
			} catch (e) {
				exception = e;
			}
			expect(exception).to.be.equal(stE);
			expect((exception as Error).stack, 'check stack original cause').to.include('Caused by: Error: oops');
			expect(iter.next().value).to.be.eql(None());
			expect(iter.next().done).to.be.equal(true);
		});

		it('should create a error result from safeResultBuilder', function () {
			const result = testFunction('error');
			expect(result.isOk).to.be.eq(false);
			expect(result.isErr).to.be.eq(true);
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeResultAsyncBuilder', async function () {
			const result = await testAsyncFunction('error');
			expect(result.isOk).to.be.eq(false);
			expect(result.isErr).to.be.eq(true);
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should have correct number type if default number value is provided', function () {
			const result = Err(stE);
			const value: number = result.unwrapOr(1);
			expect(value).to.be.equal(1);
		});

		it('should have correct undefined or number type if default undefined value is provided', function () {
			const result = Err(stE);
			const value: undefined | number = result.unwrapOr(undefined);
			expect(value).to.be.equal(undefined);
		});

		it('should have correct undefined type if default undefined value is provided', function () {
			const result = Err(stE);
			const value: undefined = result.unwrapOr(undefined);
			expect(value).to.be.equal(undefined);
		});

		it('should give "No error was set" error if error is undefined', function () {
			expect(() => Err<undefined>(undefined).unwrap()).to.throw('Result: No error was set');
		});
		it('should test Err void', function () {
			const res: IErr<void> = Err();
			expect(res.isOk).to.be.eq(false);
			expect(res.isErr).to.be.eq(true);
			expect(res.ok()).to.be.equal(undefined);
			expect(res.err()).to.be.eql(undefined);
			expect(() => res.unwrap()).to.throw(undefined);
			expect(res.unwrapOr('world')).to.be.equal('world');
		});
	});
	describe('eq', function () {
		it('should eq results', function () {
			expect(Ok('hello').eq(Ok('hello'))).to.be.eq(true);
			expect(Err(stE).eq(Err(stE))).to.be.eq(true);
			expect(Err('hello').eq(Ok('hello'))).to.be.eq(false);
		});
	});
	describe('and', function () {
		it('should have valid and equals', function () {
			const aE = new Error('another error');
			expect(Ok(2).and(Err(stE)).eq(Err(stE))).to.be.eq(true);
			expect(Err(stE).and(Ok(2)).eq(Err(stE))).to.be.eq(true);
			expect(Err(stE).and(Err(aE)).eq(Err(stE))).to.be.eq(true);
			expect(Ok(2).and(Ok(4)).eq(Ok(4))).to.be.eq(true);
		});
	});
	describe('or', function () {
		it('should have valid or equals', function () {
			const aE = new Error('another error');
			expect(Ok(2).or(Err(stE)).eq(Ok(2))).to.be.eq(true);
			expect(Err(stE).or(Ok(2)).eq(Ok(2))).to.be.eq(true);
			expect(Err(stE).or(Err(aE)).eq(Err(aE))).to.be.eq(true);
			expect(Ok(2).or(Ok(4)).eq(Ok(2))).to.be.eq(true);
		});
	});
	describe('orElse', function () {
		it('should handle or else function', async function () {
			const orResult = Ok(2) as IResult<number, number>;
			const errResult = Err(2) as IResult<number, number>;
			expect(orResult.orElse<IResult<number>>((okValue: number) => Ok(okValue + 2)).eq(Ok(2))).to.be.eq(true);
			expect(errResult.orElse<IResult<number>>((okValue: number) => Ok(okValue + 2)).eq(Ok(4))).to.be.eq(true);
			expect((await orResult.orElsePromise<IResult<number>>((okValue: number) => Promise.resolve(Ok(okValue + 2)))).eq(Ok(2))).to.be.eq(true);
			expect((await errResult.orElsePromise<IResult<number>>((okValue: number) => Promise.resolve(Ok(okValue + 2)))).eq(Ok(4))).to.be.eq(true);
			expect((await orResult.orElsePromise<IResult<number>>((okValue: number) => Ok(okValue + 2))).eq(Ok(2))).to.be.eq(true);
			expect((await errResult.orElsePromise<IResult<number>>((okValue: number) => Ok(okValue + 2))).eq(Ok(4))).to.be.eq(true);
		});
	});
	describe('andThen', function () {
		it('should handle or else function', async function () {
			const orResult = Ok(2) as IResult<number, number>;
			const errResult = Err(2) as IResult<number, number>;
			expect(orResult.andThen<IResult<number>>((okValue: number) => Ok(okValue + 2)).eq(Ok(4))).to.be.eq(true);
			expect(errResult.andThen<IResult<number>>((okValue: number) => Ok(okValue + 2)).eq(Err(2))).to.be.eq(true);
			expect((await orResult.andThenPromise<IResult<number>>((okValue: number) => Promise.resolve(Ok(okValue + 2)))).eq(Ok(4))).to.be.eq(true);
			expect((await errResult.andThenPromise<IResult<number>>((okValue: number) => Promise.resolve(Ok(okValue + 2)))).eq(Err(2))).to.be.eq(true);
			expect((await orResult.andThenPromise<IResult<number>>((okValue: number) => Ok(okValue + 2))).eq(Ok(4))).to.be.eq(true);
			expect((await errResult.andThenPromise<IResult<number>>((okValue: number) => Ok(okValue + 2))).eq(Err(2))).to.be.eq(true);
		});
	});
	describe('clone', function () {
		it('should eq a Ok result', function () {
			expect(Ok('hello').clone().eq(Ok('hello'))).to.be.eq(true);
			expect(Err(stE).clone().eq(Err(stE))).to.be.eq(true);
		});
	});
	describe('map', function () {
		it('should map a Result', function () {
			const okResult: IOk<Buffer> = Ok<string, Error>('test').map((v) => Buffer.from(v));
			expect(okResult.isOk).to.be.eq(true);
			const errResult: IErr<Error> = Err<Error, string>(new Error('test')).map((v) => Buffer.from(v));
			expect(errResult.isErr).to.be.eq(true);
		});
	});
	describe('mapErr', function () {
		it('should skip mapErr mapping', function () {
			const okResult = Ok<string, Error>('test') as IResult<string, Error>;
			const mappedOkResult: IResult<string, TypeError> = okResult.mapErr((v) => new TypeError(v.message));
			expect(mappedOkResult.isOk).to.be.eq(true);
			expect(mappedOkResult.ok()).to.be.eq('test');
		});
		it('should do mapErr mapping', function () {
			const errResult = Err<Error, string>(new Error('test')) as IResult<string, Error>;
			const mappedErrResult: IResult<string, TypeError> = errResult.mapErr((v) => new TypeError(v.message));
			expect(mappedErrResult.isErr).to.be.eq(true);
			expect(mappedErrResult.err()?.name).to.be.eq('TypeError');
		});
	});
	describe('toOption', function () {
		it('should convert to Option', function () {
			expect(Ok<string, string>('ok').toOption().eq(Some('ok'))).to.be.eq(true);
			expect(Err<string, string>('err').toOption().eq(None())).to.be.eq(true);
		});
	});
	describe('jsonErr', function () {
		it('should build error from JSON', function () {
			const json = {$class: 'Result::Err', value: new Error('hello')} as const;
			const result = Err(json);
			expect(result.isErr).to.be.eq(true);
			expect(result.err().message).to.be.equal('hello');
			expect(result.toJSON()).to.be.eql(json);
			expect(fromJsonResult(json).toJSON()).to.be.eql(result.toJSON());
		});
	});
	describe('jsonOk', function () {
		it('should build Ok from JSON', function () {
			const json = {$class: 'Result::Ok', value: 'hello'} as const;
			const result = Ok<string, Error>(json);
			expect(result.isOk).to.be.eq(true);
			expect(result.ok()).to.be.equal('hello');
			expect(result.toJSON()).to.be.eql(json);
			expect(fromJsonResult(json).toJSON()).to.be.eql(result.toJSON());
		});
	});
	describe('toString', function () {
		it('should convert to string', function () {
			expect(Ok<string, Error>('hello').toString()).to.be.equal(`Ok(hello)`);
			expect(String(Ok<string, Error>('hello'))).to.be.equal(`Ok(hello)`);
			expect(Ok<number, Error>(1).toString()).to.be.equal(`Ok(1)`);
			expect(Err(stE).toString()).to.be.equal(`Err(Error: 'oops')`);
			expect(Err(null as unknown as Error).toString()).to.be.equal(`Err(UnknownErrorInstance: 'null')`);
			expect(Err(undefined as unknown as Error).toString()).to.be.equal(`Err(UnknownErrorInstance: 'undefined')`);
			expect(Err({} as unknown as Error).toString()).to.be.equal(`Err(Object: '{}')`);
		});
		it('should convert null error instance to string', function () {
			const brokenErr = new IErr(null);
			expect(brokenErr.toString()).to.be.equal(`Err(UnknownErrorInstance: 'null')`);
		});
	});
	describe('Result', function () {
		it('should convert Result to JSON', function () {
			expect(Result.from(Ok<string>('hello')).toJSON()).to.be.eql({$class: 'Result::Ok', value: 'hello'});
			expect(Result.from(Err('error')).toJSON()).to.be.eql({$class: 'Result::Err', value: 'error'});
			expect(Result.from({$class: 'Result::Ok', value: 'hello'}).toJSON()).to.be.eql({$class: 'Result::Ok', value: 'hello'});
			expect(Result.from({$class: 'Result::Err', value: 'error'}).toJSON()).to.be.eql({$class: 'Result::Err', value: 'error'});
			expect(() => Result.from(null as any)).to.throw(TypeError, 'Invalid Result type');
		});
		it('should make safeCall', function () {
			expect(Result.safeCall(() => 'hello')).to.be.eql(Ok('hello'));
			expect(
				Result.safeCall(() => {
					throw new Error('error');
				}),
			).to.be.eql(Err(new Error('error')));
		});
		it('should make safeCall', async function () {
			await expect(Result.safeAsyncCall(() => 'hello')).resolves.eql(Ok('hello'));
			await expect(
				Result.safeAsyncCall(() => {
					throw new Error('error');
				}),
			).resolves.eql(Err(new Error('error')));
		});
	});
	describe('matchResult', function () {
		it('should match Ok result', function () {
			const result = Ok('hello') as IResult<string, Error>;
			expect(
				Result.match(result, {
					Ok: (value) => `${value} world`,
					Err: (err) => `${err.message} world`,
				}),
			).to.be.equal('hello world');
		});
		it('should match Ok result', function () {
			const result = Ok('hello');
			expect(
				Result.match(result, {
					Ok: (value) => `${value} world`,
					Err: (err) => `${JSON.stringify(err)} world`,
				}),
			).to.be.equal('hello world');
		});
		it('should match Err result', function () {
			const result = Err(new Error('oops'));
			expect(
				Result.match(result, {
					Ok: (value) => `${value} world`,
					Err: (err) => `${err.message} world`,
				}),
			).to.be.equal('oops world');
		});
	});
	describe('resultFlow', function () {
		it('should run flow of results to single Ok', function () {
			expect(Result.flow(Ok('hello')).ok()).to.be.equal('hello');
		});
		it('should run flow of results to Ok', function () {
			expect(
				Result.flow(
					Ok('hello'),
					(value) => Ok(`${value} world`),
					(value) => Ok(value.length),
					(value) => Ok(value.toString()),
				).ok(),
			).to.be.equal('11');
		});
		it('should run flow of results to last Error', function () {
			const res = Result.flow(
				Ok('hello'),
				(value) => Ok(`${value} world`),
				(value) => Ok(value.length),
				(_value) => Err(new Error('oops')),
			);
			expect(res.err()?.message).to.be.equal('oops');
		});
		it('should run flow of results to last Error', function () {
			const res = Result.flow(
				Err(new Error('oops')) as IResult<string, Error>,
				(value) => Ok(`${value} world`),
				(value) => Ok(value.length),
				(value) => Ok(value.toString()),
			);
			expect(res.err()?.message).to.be.equal('oops');
		});
		it('should throw uncontrolled error in flow', function () {
			expect(() =>
				Result.flow(
					Ok('hello'),
					(value) => Ok(`${value} world`),
					(value) => Ok(value.length),
					(_value) => {
						throw new Error('oops');
					},
				),
			).to.throw('Fatal Uncontrolled error: oops');
			expect(() =>
				Result.flow(
					Ok('hello'),
					(value) => Ok(`${value} world`),
					(value) => Ok(value.length),
					(_value) => {
						// eslint-disable-next-line @typescript-eslint/only-throw-error
						throw 'oops';
					},
				),
			).to.throw('Fatal Uncontrolled error: "oops"');
		});
	});
	describe('resultAsyncFlow', function () {
		it('should run flow of results to single Ok', async function () {
			const res = await Result.asyncFlow(Ok('hello'));
			expect(res.ok()).toBe('hello');
		});
		it('should run flow of results to Ok', async function () {
			const res = await Result.asyncFlow(
				Ok('hello'),
				(value) => Promise.resolve(Ok(`${value} world`)),
				(value) => Promise.resolve(Ok(value.length)),
				(value) => Promise.resolve(Ok(value.toString())),
			);
			expect(res.ok()).to.be.equal('11');
		});
		it('should run flow of results to last Error', async function () {
			const res = await Result.asyncFlow(
				Ok('hello'),
				(value) => Promise.resolve(Ok(`${value} world`)),
				(value) => Promise.resolve(Ok(value.length)),
				(_value) => Promise.resolve(Err(new Error('oops'))),
			);
			expect(res.err()?.message).to.be.equal('oops');
		});
		it('should run flow of results to last Error', async function () {
			const res = await Result.asyncFlow(
				Err(new Error('oops')) as IResult<string, Error>,
				(value) => Promise.resolve(Ok(`${value} world`)),
				(value) => Promise.resolve(Ok(value.length)),
				(value) => Promise.resolve(Ok(value.toString())),
			);
			expect(res.err()?.message).to.be.equal('oops');
		});
		it('should throw uncontrolled error in flow', async function () {
			await expect(
				Result.asyncFlow(
					Ok('hello'),
					(value) => Promise.resolve(Ok(`${value} world`)),
					(value) => Promise.resolve(Ok(value.length)),
					(_value) => {
						throw new Error('oops');
					},
				),
			).rejects.toThrowError('Fatal Uncontrolled error: oops');
			await expect(
				Result.asyncFlow(
					Ok('hello'),
					(value) => Promise.resolve(Ok(`${value} world`)),
					(value) => Promise.resolve(Ok(value.length)),
					(_value) => {
						// eslint-disable-next-line @typescript-eslint/only-throw-error
						throw 'oops';
					},
				),
			).rejects.toThrowError('Fatal Uncontrolled error: "oops"');
		});
	});
	describe('Test resultAll', function () {
		it('should be valid all result type and Ok', function () {
			expect(Result.all(ok1, ok2, ok3)).to.be.eql(Ok([1, '2', new Date(0)]));
			expect(
				Result.all(
					() => ok1,
					() => ok2,
					() => ok3,
				),
			).to.be.eql(Ok([1, '2', new Date(0)]));
		});
		it('should be valid all result type and Err', function () {
			expect(Result.all(ok1, ok2, err1)).to.be.eql(err1);
		});
	});
	describe('Test resultAsyncAll', function () {
		it('should be valid all result type and Ok', async function () {
			await expect(Result.asyncAll(ok1, ok2, ok3)).resolves.eql(Ok([1, '2', new Date(0)]));
			await expect(
				Result.asyncAll(
					() => Promise.resolve(ok1),
					() => Promise.resolve(ok2),
					() => Promise.resolve(ok3),
				),
			).resolves.eql(Ok([1, '2', new Date(0)]));
		});
		it('should be valid all result type and Err', async function () {
			await expect(Result.asyncAll(ok1, ok2, err1)).resolves.eql(err1);
		});
	});
	describe('Test iterable', function () {
		it('should build valid result instances', async function () {
			expect(Array.from(Result.iterator([1, 2, 3]))).to.be.eql([Ok(1), Ok(2), Ok(3)]);
		});
	});
	describe('Test async iterable', function () {
		it('should build valid result instances', async function () {
			const asyncIterable: AsyncIterable<number> = {
				async *[Symbol.asyncIterator]() {
					yield 1;
					yield 2;
					yield 3;
				},
			};
			await expect(Result.asAsyncArray(Result.asyncIterator(asyncIterable))).resolves.eql(Ok([1, 2, 3]));
		});
		it('should build valid result instances', async function () {
			const asyncIterable: AsyncIterable<number> = {
				async *[Symbol.asyncIterator]() {
					yield 1;
					throw new Error('oops');
				},
			};
			await expect(Result.asAsyncArray(Result.asyncIterator(asyncIterable))).resolves.eql(Err(new Error('oops')));
		});
	});
	describe('Test asArray', function () {
		it('should build valid Ok array', async function () {
			expect(Result.asArray(Result.iterator([1, 2, 3]))).to.be.eql(Ok([1, 2, 3]));
		});
		it('should build valid Err', async function () {
			const syncIterable: Iterable<number> = {
				*[Symbol.iterator]() {
					yield 1;
					throw new Error('oops');
				},
			};
			expect(Result.asArray(Result.iterator(syncIterable))).to.be.eql(Err(new Error('oops')));
		});
	});
});
