import * as chai from 'chai';
import 'mocha';
import {solveErrorByName, solveErrorInstance} from '../src/index.js';

const expect = chai.expect;

describe('Test', function () {
	it('should', function () {
		const err = new Error('demo');
		expect(solveErrorInstance(err, solveErrorByName<Error>('Error'))).to.equal(err);
		expect(solveErrorInstance(err, solveErrorByName<Error>('BrokenError'))).to.equal(false);
	});
});
