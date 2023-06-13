/* eslint-disable no-unused-expressions */
import 'mocha';
import * as chai from 'chai';
import {FunctionResult} from '../src/';

const expect = chai.expect;

describe('FunctionResult', () => {
	it('should create a value result from callback', async () => {
		const value = 'hello';
		const result = FunctionResult.from<string>(() => value);
		expect(result.isOk()).to.be.true;
		expect(result.isError()).to.be.false;
		expect(result.ok()).to.be.equal(value);
		expect(result.error()).to.be.equal(undefined);
		expect(result.unwrap()).to.be.equal(value);
		expect(result.unwrapOrDefault('world')).to.be.equal(value);
	});

	it('should create a error result from callback', async () => {
		const error = new Error('oops');
		const result = FunctionResult.from<string>(() => {
			throw error;
		});
		expect(result.isOk()).to.be.false;
		expect(result.isError()).to.be.true;
		expect(result.ok()).to.be.equal(undefined);
		expect(result.error()).to.be.eql(error);
		expect(() => result.unwrap()).to.throw(error);
		expect(result.unwrapOrDefault('world')).to.be.equal('world');
	});
});
