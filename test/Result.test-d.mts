import {assertType, describe, it} from 'vitest';
import {Err, type IResult, Ok, Result} from '../src/index.mjs';

const ok1 = Result.from<number, Error>(Ok(1));
const ok2 = Result.from<string, Error>(Ok('2'));
const ok3 = Result.from<Date, Error>(Ok(new Date(0)));
const err1 = Result.from<Date, Error>(Err(new Error('broken')));

describe('Result type tests', function () {
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
		it('should be valid result from last flow result', function () {
			assertType<Promise<IResult<string, Error>>>(
				Result.asyncFlow(
					ok1,
					(value) => Ok(`${value} world`),
					(value) => Ok(value.length),
					(value) => Ok(value.toString()),
				),
			);
		});
	});
});
