/* eslint-disable no-unused-expressions */
import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {AsyncResult, safeAsyncResult} from '../src/';

const expect = chai.expect;

chai.use(chaiAsPromised);

const testPromiseFunction = safeAsyncResult(async (value: string) => {
	if (value === 'error') {
		throw new Error('oops');
	}
	return value;
});

describe('PromiseResult', () => {
	it('should create a resolved promise result', async () => {
		const value = 'hello';
		const result = AsyncResult.from<string>(Promise.resolve(value));
		await expect(result.isOk()).to.be.eventually.true;
		await expect(result.isErr()).to.be.eventually.false;
		await expect(result.ok()).to.be.eventually.equal(value);
		await expect(result.err()).to.be.eventually.equal(undefined);
		await expect(result.unwrap()).to.be.eventually.equal(value);
		await expect(result.unwrapOrDefault('world')).to.be.eventually.equal(value);
	});

	it('should create a resolved callback promise result', async () => {
		const value = 'hello';
		const result = AsyncResult.from<string>(() => Promise.resolve(value));
		await expect(result.isOk()).to.be.eventually.true;
		await expect(result.isErr()).to.be.eventually.false;
		await expect(result.ok()).to.be.eventually.equal(value);
		await expect(result.err()).to.be.eventually.equal(undefined);
		await expect(result.unwrap()).to.be.eventually.equal(value);
		await expect(result.unwrapOrDefault('world')).to.be.eventually.equal(value);
	});

	it('should resolve safeAsyncResult Result', async () => {
		const value = 'hello';
		const result = testPromiseFunction(value);
		await expect(result.isOk()).to.be.eventually.true;
		await expect(result.isErr()).to.be.eventually.false;
		await expect(result.ok()).to.be.eventually.equal(value);
		await expect(result.err()).to.be.eventually.equal(undefined);
		await expect(result.unwrap()).to.be.eventually.equal(value);
		await expect(result.unwrapOrDefault('world')).to.be.eventually.equal(value);
	});

	it('should create a rejected promise result', async () => {
		const error = new Error('oops');
		const result = AsyncResult.from<string>(Promise.reject(error));
		await expect(result.isOk()).to.be.eventually.false;
		await expect(result.isErr()).to.be.eventually.true;
		await expect(result.ok()).to.be.eventually.equal(undefined);
		await expect(result.err()).to.be.eventually.eql(error);
		await expect(result.unwrap()).to.be.eventually.rejectedWith(error);
		await expect(result.unwrapOrDefault('world')).to.be.eventually.equal('world');
	});

	it('should create a rejected callback promise result', async () => {
		const error = new Error('oops');
		const result = AsyncResult.from<string>(() => Promise.reject(error));
		await expect(result.isOk()).to.be.eventually.false;
		await expect(result.isErr()).to.be.eventually.true;
		await expect(result.ok()).to.be.eventually.equal(undefined);
		await expect(result.err()).to.be.eventually.eql(error);
		await expect(result.unwrap()).to.be.eventually.rejectedWith(error);
		await expect(result.unwrapOrDefault('world')).to.be.eventually.equal('world');
	});
});
