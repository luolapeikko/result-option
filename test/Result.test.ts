/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-unused-expressions */
import 'mocha';
import * as chai from 'chai';
import {Err, None, Ok, Result, Some, safeAsyncResult, safeAsyncResultBuilder, safeResult, safeResultBuilder} from '../src';

const expect = chai.expect;

const stE = new Error('oops');

const testFunction = safeResultBuilder((value: string) => {
	if (value === 'error') {
		throw stE;
	}
	return value;
});

const testAsyncFunction = safeAsyncResultBuilder(async (value: string) => {
	if (value === 'error') {
		throw stE;
	}
	return value;
});

describe('FunctionResult', () => {
	describe('Ok', () => {
		it('should resolve a value result from Ok Result', async () => {
			const value = 'hello';
			const result: Result<string, Error> = Ok<string, Error>(value);
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
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

		it('should resolve a value result from safeResult', async () => {
			const value = 'hello';
			const result: Result<string, Error> = safeResult<string, Error>(() => value);
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
			expect(
				result.match({
					Ok: (value) => `${value} world`,
					Err: (err) => `${err.message} world`,
				}),
			).to.be.equal(`${value} world`);
		});

		it('should resolve a value result from safeResult with Ok', async () => {
			const value = 'hello';
			const result: Result<string> = safeResult<string, unknown>(() => Ok(value));
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
			expect(result.unwrapOrElse(() => 'world')).to.be.equal(value);
			expect(result.unwrapOrValueOf(String)).to.be.equal(value);
		});

		it('should resolve with safeResultBuilder function', async () => {
			const value = 'hello';
			const result: Result<string> = testFunction(value);
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});
		it('should resolve with safeAsyncResult Promise', async () => {
			const value = 'hello';
			const result: Result<string> = await safeAsyncResult(Promise.resolve(value));
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});
		it('should resolve with safeAsyncResult callback Promise', async () => {
			const value = 'hello';
			const result: Result<string> = await safeAsyncResult(() => Promise.resolve(value));
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});

		it('should resolve with safeAsyncResult callback Promise with Ok', async () => {
			const value = 'hello';
			const result: Result<string> = await safeAsyncResult(() => Promise.resolve(Ok(value)));
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});
		it('should resolve with safeAsyncResultBuilder function', async () => {
			const value = 'hello';
			const result: Result<string> = await testAsyncFunction(value);
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});

		it('should resolve with dual safeResult chain', async () => {
			const value = 'hello';
			const callback = safeResultBuilder((v: string) => testFunction(v));
			const result: Result<string> = callback(value);
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});

		it('should resolve with dual safeAsyncResult chain', async () => {
			const value = 'hello';
			const callback = safeAsyncResultBuilder((v: string) => testAsyncFunction(v));
			const result: Result<string> = await callback(value);
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
		});
	});
	describe('Err', () => {
		it('should create a error result from Err', async () => {
			const demoError = new Error('demo');
			const result = Err(Err(stE)); // chaining Err
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(() => result.unwrap(() => demoError)).to.throw(demoError);
			expect(result.unwrapOr('world')).to.be.equal('world');
			expect(result.unwrapOrElse(() => 'world')).to.be.equal('world');
			expect(result.unwrapOrValueOf(String)).to.be.equal('');
			expect(
				result.match({
					Ok: (value) => `${value} world`,
					Err: (err) => `${err.message} world`,
				}),
			).to.be.equal('oops world');
		});

		it('should create a error result from safeResult', async () => {
			const result = safeResult<string>(() => {
				throw stE;
			});
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeResult with Err', async () => {
			const result = safeResult<string>(() => {
				return Err(stE);
			});
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeResultBuilder', async () => {
			const result = testFunction('error');
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeResultAsyncBuilder', async () => {
			const result = await testAsyncFunction('error');
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeAsyncResult', async () => {
			const result = await safeAsyncResult<string>(async () => {
				throw stE;
			});
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeAsyncResult with Err', async () => {
			const result = await safeAsyncResult<string>(async () => {
				return Err(stE);
			});
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(stE);
			expect(() => result.unwrap()).to.throw(stE);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should have correct number type if default number value is provided', async () => {
			const result = Err<number>(stE);
			const value: number = result.unwrapOr(1);
			expect(value).to.be.equal(1);
		});

		it('should have correct undefined or number type if default undefined value is provided', async () => {
			const result = Err<number>(stE);
			const value: undefined | number = result.unwrapOr(undefined);
			expect(value).to.be.equal(undefined);
		});

		it('should have correct undefined type if default undefined value is provided', async () => {
			const result = Err<undefined>(stE);
			const value: undefined = result.unwrapOr(undefined);
			expect(value).to.be.equal(undefined);
		});

		it('should give "No error was set" error if error is undefined', async () => {
			expect(() => Err<undefined>(undefined).unwrap()).to.throw('Result: No error was set');
		});
	});
	describe('eq', () => {
		it('should eq results', async () => {
			expect(Ok<string, Error>('hello').eq(Ok<string, Error>('hello'))).to.be.true;
			expect(Err<string, Error>(stE).eq(Err<string, Error>(stE))).to.be.true;
			expect(Err<string, string>('hello').eq(Ok<string, Error>('hello'))).to.be.false;
		});
	});
	describe('and', () => {
		it('should have valid and equals', async () => {
			const aE = new Error('another error');
			expect(Ok(2).and(Err(stE)).eq(Err(stE))).to.be.true;
			expect(Err(stE).and(Ok(2)).eq(Err(stE))).to.be.true;
			expect(Err(stE).and(Err(aE)).eq(Err(stE))).to.be.true;
			expect(Ok(2).and(Ok(4)).eq(Ok(4))).to.be.true;
		});
	});
	describe('or', () => {
		it('should have valid or equals', async () => {
			const aE = new Error('another error');
			expect(Ok(2).or(Err(stE)).eq(Ok(2))).to.be.true;
			expect(Err(stE).or(Ok(2)).eq(Ok(2))).to.be.true;
			expect(Err(stE).or(Err(aE)).eq(Err(aE))).to.be.true;
			expect(Ok(2).or(Ok(4)).eq(Ok(2))).to.be.true;
		});
	});
	describe('orElse', () => {
		it('should handle or else function', async () => {
			expect(
				Ok<number, number>(2)
					.orElse((errValue) => Ok(errValue + 2))
					.eq(Ok(2)),
			).to.be.true;
		});
		expect(
			Err<number, number>(2)
				.orElse((errValue) => Ok(errValue + 2))
				.eq(Ok(4)),
		).to.be.true;
	});
	describe('andThen', () => {
		it('should handle or else function', async () => {
			expect(
				Ok<number, number>(2)
					.andThen((okValue) => Ok(okValue + 2))
					.eq(Ok(4)),
			).to.be.true;
		});
		expect(
			Err<number, number>(2)
				.andThen((okValue) => Ok(okValue + 2))
				.eq(Err(2)),
		).to.be.true;
	});
	describe('clone', () => {
		it('should eq a Ok result', async () => {
			expect(Ok<string, Error>('hello').cloned().eq(Ok<string, Error>('hello'))).to.be.true;
			expect(Err<string, Error>(stE).cloned().eq(Err<string, Error>(stE))).to.be.true;
		});
	});
	describe('toOption', () => {
		it('should convert to Optionn', async () => {
			expect(Ok<string, string>('ok').toOption().eq(Some('ok'))).to.be.true;
			expect(Err<string, string>('err').toOption().eq(None())).to.be.true;
		});
	});
});
