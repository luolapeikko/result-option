import {assertType, describe, it} from 'vitest';
import type {IResult} from '@luolapeikko/result-option';

function test(value: string): boolean {
	return value.length > 0;
}

describe('module load type testing', () => {
	it('should have correct type', async () => {
		const loaded = await import('@luolapeikko/result-option');
		const wrappedResultFn = loaded.Result.wrapFn<Error>(test);
		assertType<IResult<boolean, Error>>(wrappedResultFn('asd'));
	});
});
