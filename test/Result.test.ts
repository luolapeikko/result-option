/* eslint-disable no-unused-expressions */
import 'mocha';
import * as chai from 'chai';
import {Err, IResult, Ok, safeAsyncResult, safeAsyncResultBuilder, safeResult, safeResultBuilder} from '../src';

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
			const result: IResult<string> = new Ok(value);
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});

		it('should resolve a value result from safeResult', async () => {
			const value = 'hello';
			const result: IResult<string> = safeResult<string, unknown>(() => value);
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});

		it('should resolve a value result from safeResult with Ok', async () => {
			const value = 'hello';
			const result: IResult<string> = safeResult<string, unknown>(() => new Ok(value));
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});

		it('should resolve with safeResultBuilder function', async () => {
			const value = 'hello';
			const result: IResult<string> = testFunction(value);
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});
		it('should resolve with safeAsyncResult Promise', async () => {
			const value = 'hello';
			const result: IResult<string> = await safeAsyncResult(Promise.resolve(value));
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});
		it('should resolve with safeAsyncResult callback Promise', async () => {
			const value = 'hello';
			const result: IResult<string> = await safeAsyncResult(() => Promise.resolve(value));
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});

		it('should resolve with safeAsyncResult callback Promise with Ok', async () => {
			const value = 'hello';
			const result: IResult<string> = await safeAsyncResult(() => Promise.resolve(new Ok(value)));
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});
		it('should resolve with safeAsyncResultBuilder function', async () => {
			const value = 'hello';
			const result: IResult<string> = await testAsyncFunction(value);
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});

		it('should resolve with dual safeResult chain', async () => {
			const value = 'hello';
			const callback = safeResultBuilder((v: string) => testFunction(v));
			const result: IResult<string> = callback(value);
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});

		it('should resolve with dual safeAsyncResult chain', async () => {
			const value = 'hello';
			const callback = safeAsyncResultBuilder((v: string) => testAsyncFunction(v));
			const result: IResult<string> = await callback(value);
			expect(result.isOk()).to.be.true;
			expect(result.isErr()).to.be.false;
			expect(result.ok()).to.be.equal(value);
			expect(result.err()).to.be.equal(undefined);
			expect(result.unwrap()).to.be.equal(value);
			expect(result.unwrapOrDefault('world')).to.be.equal(value);
		});
	});
	describe('Err', () => {
		it('should create a error result from Err', async () => {
			const result = new Err(staticError);
			expect(result.isOk()).to.be.false;
			expect(result.isErr()).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOrDefault('world')).to.be.equal('world');
		});

		it('should create a error result from safeResult', async () => {
			const result = safeResult<string>(() => {
				throw staticError;
			});
			expect(result.isOk()).to.be.false;
			expect(result.isErr()).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOrDefault('world')).to.be.equal('world');
		});

		it('should create a error result from safeResult with Err', async () => {
			const result = safeResult<string>(() => {
				return new Err(staticError);
			});
			expect(result.isOk()).to.be.false;
			expect(result.isErr()).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOrDefault('world')).to.be.equal('world');
		});

		it('should create a error result from safeResultBuilder', async () => {
			const result = testFunction('error');
			expect(result.isOk()).to.be.false;
			expect(result.isErr()).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOrDefault('world')).to.be.equal('world');
		});

		it('should create a error result from safeResultAsyncBuilder', async () => {
			const result = await testAsyncFunction('error');
			expect(result.isOk()).to.be.false;
			expect(result.isErr()).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOrDefault('world')).to.be.equal('world');
		});

		it('should create a error result from safeAsyncResult', async () => {
			const result = await safeAsyncResult<string>(async () => {
				throw staticError;
			});
			expect(result.isOk()).to.be.false;
			expect(result.isErr()).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOrDefault('world')).to.be.equal('world');
		});

		it('should create a error result from safeAsyncResult with Err', async () => {
			const result = await safeAsyncResult<string>(async () => {
				return new Err(staticError);
			});
			expect(result.isOk()).to.be.false;
			expect(result.isErr()).to.be.true;
			expect(result.ok()).to.be.equal(undefined);
			expect(result.err()).to.be.eql(staticError);
			expect(() => result.unwrap()).to.throw(staticError);
			expect(result.unwrapOrDefault('world')).to.be.equal('world');
		});

		it('should have correct number type if default number value is provided', async () => {
			const result = new Err<number | undefined>(staticError);
			const value = result.unwrapOrDefault(1);
			expect(value).to.be.equal(1);
		});

		it('should have correct undefined or number type if default undefined value is provided', async () => {
			const result = new Err<number | undefined>(staticError);
			const value: undefined | number = result.unwrapOrDefault(undefined);
			expect(value).to.be.equal(undefined);
		});

		it('should have correct undefined type if default undefined value is provided', async () => {
			const result = new Err<undefined>(staticError);
			const value = result.unwrapOrDefault(undefined);
			expect(value).to.be.equal(undefined);
		});
	});
});
