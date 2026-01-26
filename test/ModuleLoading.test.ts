import {describe, expect, it} from 'vitest';

describe('module load testing', () => {
	it('test CJS loading', () => {
		const {Result} = require('@luolapeikko/result-option');
		expect(Result).toBeInstanceOf(Object);
	});
	it('test ESM loading', async () => {
		const {Result} = await import('@luolapeikko/result-option');
		expect(Result).toBeInstanceOf(Object);
	});
});
