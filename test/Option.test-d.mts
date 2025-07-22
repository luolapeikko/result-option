import {assertType, describe, it} from 'vitest';
import {type INone, type ISome, None, Option, Some} from '../src/index.mjs';

const some1 = Option.from<number>(Some(1));
const some2 = Option.from<string>(Some('2'));
const some3 = Option.from<Date>(Some(new Date(0)));
const none1 = Option.from<Date>(None());

describe('Result type tests', function () {
	describe('Test IOption', function () {
		it('should be valid IOption', function () {
			const option = Option.from(Some(1));
			if (option.isSome) {
				assertType<ISome<number>>(option);
			} else {
				assertType<INone>(option);
			}
		});
	});
	describe('Test Result.all and Result.asyncAll', function () {
		it('should be valid all result type', function () {
			assertType<ISome<[number, string, Date]> | INone>(Option.all(some1, some2, some3));
			assertType<ISome<[number, string, Date]> | INone>(Option.all(some1, some2, none1));
			assertType<ISome<[number, string, Date]> | INone>(
				Option.all(
					() => some1,
					() => some2,
					() => some3,
				),
			);
		});
		it('should be valid all async result type', function () {
			assertType<Promise<ISome<[number, string, Date]> | INone>>(Option.asyncAll(some1, some2, some3));
			assertType<Promise<ISome<[number, string, Date]> | INone>>(Option.asyncAll(some1, some2, none1));
			assertType<Promise<ISome<[number, string, Date]> | INone>>(
				Option.asyncAll(
					() => Promise.resolve(some1),
					() => Promise.resolve(some2),
					some3,
				),
			);
		});
	});
});
