import {assertType, describe, it} from 'vitest';
import {Err, type IResult, Ok, Result} from '../src/index.mjs';

const ok1 = Result.from<number, Error>(Ok(1));
const ok2 = Result.from<string, Error>(Ok('2'));
const ok3 = Result.from<Date, Error>(Ok(new Date(0)));
const err1 = Result.from<Date, Error>(Err(new Error('broken')));

function overrideMockup(isOther: true): Buffer;
function overrideMockup(isOther: false): string;
function overrideMockup(isOther: boolean): string | Buffer {
	return isOther ? Buffer.from('mockup') : 'mockup';
}

const wrappedOverrideFn = Result.wrapFn<Error>(overrideMockup);

// Test functions that already return IResult
const fnReturnsResult = (value: string): IResult<number, Error> => {
	return Ok(value.length);
};

const asyncFnReturnsResult = async (value: string): Promise<IResult<number, Error>> => {
	return Ok(value.length);
};

const wrappedResultFn = Result.wrapFn<Error, typeof fnReturnsResult>(fnReturnsResult);
const wrappedAsyncResultFn = Result.wrapAsyncFn<Error, typeof asyncFnReturnsResult>(asyncFnReturnsResult);

describe('Result type tests', function () {
	describe('Test wrapAsyncFn with overloads', function () {
		it('should preserve function overloads', function () {
			assertType<IResult<Buffer, Error>>(wrappedOverrideFn(true));
			assertType<IResult<string, Error>>(wrappedOverrideFn(false));
		});
	});
	describe('Test wrapFn and wrapAsyncFn with functions returning IResult', function () {
		it('should unwrap IResult and not double-wrap', function () {
			// wrappedResultFn should return IResult<number, Error>, not IResult<IResult<number, Error>, Error>
			assertType<IResult<number, Error>>(wrappedResultFn('test'));
		});
		it('should unwrap IResult for async functions', async function () {
			// wrappedAsyncResultFn should return Promise<IResult<number, Error>>, not Promise<IResult<IResult<number, Error>, Error>>
			assertType<Promise<IResult<number, Error>>>(wrappedAsyncResultFn('test'));
		});
	});
	
	describe('Test Result.all and Result.asyncAll', function () {
		it('should be valid all result type', function () {
			assertType<IResult<[number, string, Date], Error>>(Result.all(ok1, ok2, ok3));
			assertType<IResult<[number, string, Date], Error>>(Result.all(ok1, ok2, err1));
			assertType<IResult<[number, string, Date], Error>>(
				Result.all(
					() => ok1,
					() => ok2,
					() => ok3,
				),
			);
		});
		it('should be valid all async result type', function () {
			assertType<Promise<IResult<[number, string, Date], Error>>>(Result.asyncAll(ok1, ok2, ok3));
			assertType<Promise<IResult<[number, string, Date], Error>>>(Result.asyncAll(ok1, ok2, err1));
			assertType<Promise<IResult<[number, string, Date], Error>>>(
				Result.asyncAll(
					() => Promise.resolve(ok1),
					() => Promise.resolve(ok2),
					ok3,
				),
			);
		});
	});
	describe('Test Result flows', function () {
		it('should be valid result from last flow result', function () {
			assertType<IResult<string, Error>>(
				Result.flow(
					ok1,
					(value) => Ok(`${value} world`),
					(value) => Ok(value.length),
					(value) => Ok(value.toString()),
				),
			);
		});
		it('should be valid result from last tupleFlow result', function () {
			assertType<IResult<string, Error>>(
				Result.tupleFlow(
					ok1,
					(one) => Ok(`${one} world`),
					(one, oneWorld) => Ok(oneWorld.length),
					(one, oneWorld, length) => Ok(length.toString()),
				),
			);
		});
		it('should be valid result from last asyncFlow result', function () {
			assertType<Promise<IResult<string, Error>>>(
				Result.asyncFlow(
					ok1,
					(value) => Ok(`${value} world`),
					(value) => Ok(value.length),
					(value) => Ok(value.toString()),
				),
			);
		});
		it('should be valid result from last asyncTupleFlow result', function () {
			assertType<Promise<IResult<string, Error>>>(
				Result.asyncTupleFlow(
					ok1,
					(one) => Ok(`${one} world`),
					(one, oneWorld) => Ok(oneWorld.length),
					(one, oneWorld, length) => Ok(length.toString()),
				),
			);
		});
	});
	describe('andThen chaining', function () {
		it('should be valid type chain', function () {
			const first = Ok(1);
			const second = () => Err(new Error('error'));
			const third = () => Ok(3);
			assertType<IResult<number, Error>>(first.andThen(second));
			assertType<IResult<number, Error>>(first.andThen(second).andThen(third));
		});
	});
	describe('orElse', function () {
		it('should be valid type chain', function () {
			const first = Ok(1);
			const second = () => Err(new Error('error'));
			const third = () => Ok(3);
			assertType<IResult<number, Error>>(first.orElse(second));
			assertType<IResult<number, Error>>(first.orElse(second).orElse(third));
		});
	});
});
