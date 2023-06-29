/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-unused-expressions */
import 'mocha';
import * as chai from 'chai';
import {None, Some} from '../src';

const expect = chai.expect;

describe('Option', () => {
	describe('Some', () => {
		it('should verify Some option', async () => {
			const value = 'hello';
			expect(Some(value).isSome()).to.be.true;
			expect(Some(value).isNone()).to.be.false;
			expect(Some(value).eq(Some(value))).to.be.true;
			expect(Some(value).eq(None<string>())).to.be.false;
			expect(Some(value).unwrap()).to.be.equal(value);
			expect(Some(value).unwrapOr('demo')).to.be.equal(value);
			expect(Some(value).unwrapOrElse(() => 'demo')).to.be.equal(value);
			expect(Some(value).unwrapOrValueOf(String)).to.be.equal(value);
			expect(Some(value).expect('some error')).to.be.equal(value);
			const instace = Some(value);
			expect(instace.take().isSome()).to.be.true;
			expect(instace.isNone()).to.be.true;
		});
	});
	describe('None', () => {
		it('should verify None option', async () => {
			expect(None<string>().isSome()).to.be.false;
			expect(None<string>().isNone()).to.be.true;
			expect(None<string>().eq(Some('hello'))).to.be.false;
			expect(None<string>().eq(None<string>())).to.be.true;
			expect(() => None<string>().unwrap()).to.throw('Option: No value was set');
			expect(() => None<string>().unwrap((err) => new Error(err.message + '!'))).to.throw('Option: No value was set!');
			expect(None<string>().unwrapOr('demo')).to.be.equal('demo');
			expect(None<string>().unwrapOrElse(() => 'demo')).to.be.equal('demo');
			expect(None<string>().unwrapOrValueOf(String)).to.be.equal(''); // string default value is empty string
			expect(() => None<string>().expect('some error')).to.throw('some error');
			const instace = None<string>();
			expect(instace.take().isNone()).to.be.true;
			expect(instace.isNone()).to.be.true;
		});
	});
});
