/* eslint-disable no-unused-expressions */
import 'mocha';
import * as chai from 'chai';
import {safeResult, SyncResult} from '../src/';

const expect = chai.expect;

const testFunction = safeResult((value: string) => {
	if (value === 'error') {
		throw new Error('oops');
	}
	return value;
});

describe('FunctionResult', () => {
	it('should create a value result from callback', async () => {
		const value = 'hello';
		const result = SyncResult.from<string>(() => value);
		expect(result.isOk()).to.be.true;
		expect(result.isErr()).to.be.false;
		expect(result.ok()).to.be.equal(value);
		expect(result.err()).to.be.equal(undefined);
		expect(result.unwrap()).to.be.equal(value);
		expect(result.unwrapOrDefault('world')).to.be.equal(value);
	});

	it('should resolve with safeResult function', async () => {
		const value = 'hello';
		const result = testFunction(value);
		expect(result.isOk()).to.be.true;
		expect(result.isErr()).to.be.false;
		expect(result.ok()).to.be.equal(value);
		expect(result.err()).to.be.equal(undefined);
		expect(result.unwrap()).to.be.equal(value);
		expect(result.unwrapOrDefault('world')).to.be.equal(value);
	});

	it('should create a error result from callback', async () => {
		const error = new Error('oops');
		const result = SyncResult.from<string>(() => {
			throw error;
		});
		expect(result.isOk()).to.be.false;
		expect(result.isErr()).to.be.true;
		expect(result.ok()).to.be.equal(undefined);
		expect(result.err()).to.be.eql(error);
		expect(() => result.unwrap()).to.throw(error);
		expect(result.unwrapOrDefault('world')).to.be.equal('world');
	});
});
