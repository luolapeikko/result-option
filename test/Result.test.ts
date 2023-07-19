/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-unused-expressions */
import 'mocha';
import * as chai from 'chai';
import {Err, Ok, Result, safeAsyncResult, safeAsyncResultBuilder, safeResult, safeResultBuilder} from '../src';
import {exactType} from './helper';

const expect = chai.expect;

const staticError = new Error('oops');

const testFunction = safeResultBuilder((value: string) => {
	if (value === 'error') {
		throw staticError;
	}
	return value;
});

const testAsyncFunction = safeAsyncResultBuilder(async (value: string) => {
	if (value === 'error') {
		throw staticError;
	}
	return value;
});

describe('FunctionResult', () => {
	describe('Ok', () => {
		it('should resolve a value result from Ok Result', async () => {
			const value = 'hello';
			const result = Ok<string, Error>(value) as Result<string, Error>;
			expect(result.isOk).to.be.true;
			expect(result.isErr).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOr('world')).to.be.equal(value);
			// Ok and Err type validation
			if (result.isOk) {
				exactType(result, Ok<string, Error>(value));
			} else {
				exactType(result, Err<string, Error>(staticError));
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
			const result = Err(staticError);
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
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
				throw staticError;
			});
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeResult with Err', async () => {
			const result = safeResult<string>(() => {
				return Err(staticError);
			});
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeResultBuilder', async () => {
			const result = testFunction('error');
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeResultAsyncBuilder', async () => {
			const result = await testAsyncFunction('error');
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeAsyncResult', async () => {
			const result = await safeAsyncResult<string>(async () => {
				throw staticError;
			});
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should create a error result from safeAsyncResult with Err', async () => {
			const result = await safeAsyncResult<string>(async () => {
				return Err(staticError);
			});
			expect(result.isOk).to.be.false;
			expect(result.isErr).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOr('world')).to.be.equal('world');
		});

		it('should have correct number type if default number value is provided', async () => {
			const result = Err<number | undefined>(staticError);
			const value = result.unwrapOr(1);
			expect(value).to.be.equal(1);
		});

		it('should have correct undefined or number type if default undefined value is provided', async () => {
			const result = Err<number | undefined>(staticError);
			const value: undefined | number = result.unwrapOr(undefined);
			expect(value).to.be.equal(undefined);
		});

		it('should have correct undefined type if default undefined value is provided', async () => {
			const result = Err<undefined>(staticError);
			const value = result.unwrapOr(undefined);
			expect(value).to.be.equal(undefined);
		});

		it('should give "No error was set" error if error is undefined', async () => {
			const result = Err<undefined>(undefined);
			expect(() => result.unwrap()).to.throw('Result: No error was set');
		});
	});
});
