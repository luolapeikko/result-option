/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-unused-expressions */
import 'mocha';
import * as chai from 'chai';
import {Err, type IOption, nanOption, None, nullishOptionWrap, Ok, Some, undefinedOptionWrap} from '../src/index.js';
import {exactType} from './helper.js';

const expect = chai.expect;

describe('Option', function () {
	describe('Some', function () {
		it('should verify Some option', function () {
			const value = 'hello';
			expect(Some(value).isSome).to.be.true;
			expect(Some(value).isNone).to.be.false;
			expect(Some(value).eq(Some(value))).to.be.true;
			expect(Some(value).eq(None<string>())).to.be.false;
			expect(Some(value).unwrap()).to.be.equal(value);
			expect(Some(value).unwrapOr('demo')).to.be.equal(value);
			expect(Some(value).unwrapOrElse(() => 'demo')).to.be.equal(value);
			expect(Some(value).unwrapOrValueOf(String)).to.be.equal(value);
			expect(Some(value).expect('some error')).to.be.equal(value);
			const instace = Some(value);
			expect(instace.take().isSome).to.be.true;
			expect(instace.isNone).to.be.true;
			expect(
				Some(1).match(
					new Map([
						[1, () => 'one'],
						[2, () => 'two'],
					]),
					'other',
				),
			).to.be.equal('one');
			expect(
				Some(-1).match(
					new Map([
						[1, () => 'one'],
						[2, () => 'two'],
					]),
					'other',
				),
			).to.be.equal('other');
			// Some and None type validation
			const option = Some(1) as IOption<number>;
			if (option.isSome) {
				exactType(option, Some<number>(1));
			} else {
				exactType(option, None<number>());
			}
			// const value check
			const constValue = 'demo' as const;
			expect(Some(constValue).isSome).to.be.true;
			const demoValue: 'demo' | 'another' = Some(constValue).unwrapOr('another');
			expect(demoValue).to.be.equal('demo');
		});
	});
	describe('None', function () {
		it('should verify None option', function () {
			const demoError = new Error('demo');
			expect(None<string>().isSome).to.be.false;
			expect(None<string>().isNone).to.be.true;
			expect(None<string>().eq(Some('hello'))).to.be.false;
			expect(None<string>().eq(None<string>())).to.be.true;
			expect(() => None<string>().unwrap()).to.throw('None: No value was set');
			expect(() => None<string>().unwrap(demoError)).to.throw(demoError);
			expect(() => None<string>().unwrap((_err) => demoError)).to.throw(demoError);
			expect(None<string>().unwrapOr('demo')).to.be.equal('demo');
			expect(None<string>().unwrapOrElse(() => 'demo')).to.be.equal('demo');
			expect(None<string>().unwrapOrValueOf(String)).to.be.equal(''); // string default value is empty string
			expect(() => None<string>().expect('some error')).to.throw('some error');
			expect(() => None<string>().expect(new Error('another error'))).to.throw('another error');
			const instace = None<string>();
			expect(instace.take().isNone).to.be.true;
			expect(instace.isNone).to.be.true;
			expect(
				None<number>().match(
					new Map([
						[1, () => 'one'],
						[2, () => 'two'],
					]),
					'other',
				),
			).to.be.equal('other');
			expect(
				None<number>().match(
					new Map([
						[1, () => 'one'],
						[2, () => 'two'],
					]),
				),
			).to.be.equal(undefined);

			// const value check
			expect(None<'demo'>().isNone).to.be.true;
			const demoValue: 'demo' | 'another' = None<'demo'>().unwrapOr('another');
			expect(demoValue).to.be.equal('another');
		});
	});
	describe('undefinedOptionWrap', function () {
		it('should build option with undefinedOptionWrap', function () {
			const values = ['one', 'two', 'three', undefined] as const;
			type Values = (typeof values)[number];
			const check = (value: string): IOption<Values> => {
				return undefinedOptionWrap(values.find((v) => v === value));
			};
			expect(check('one').isSome).to.be.true;
			expect(check('two').isSome).to.be.true;
			expect(check('three').isSome).to.be.true;
			expect(check('four').isSome).to.be.false;
		});
	});
	describe('nullishOptionWrap', function () {
		it('should build option with nullishOptionWrap', function () {
			const values = ['one', 'two', 'three', null, undefined] as const;
			type Values = (typeof values)[number];
			const check = (value: string): IOption<Values> => {
				return nullishOptionWrap(values.find((v) => v === value));
			};
			expect(check('one').isSome).to.be.true;
			expect(check('two').isSome).to.be.true;
			expect(check('three').isSome).to.be.true;
			expect(check('four').isSome).to.be.false;
			expect(nullishOptionWrap<number>(NaN).isSome).to.be.false;
		});
	});
	describe('nanOptionWrap', function () {
		it('should build option with nanOptionWrap', function () {
			expect(nanOption(1).isSome).to.be.true;
			expect(nanOption(2).isSome).to.be.true;
			expect(nanOption(3).isSome).to.be.true;
			expect(nanOption(parseInt('hello', 10)).isSome).to.be.false;
		});
	});
	describe('eq', function () {
		it('should eq a Some result', function () {
			expect(Some('hello').eq(Some('hello'))).to.be.true;
		});
		it('should eq a None result', function () {
			expect(None<string>().eq(None<string>())).to.be.true;
		});
	});
	describe('clone', function () {
		it('should clone a Some result', function () {
			const value = Some('hello');
			const clone = value.cloned();
			value.take(); // take the value
			expect(value.isNone).to.be.true;
			expect(clone.isSome).to.be.true;
		});
		it('should clone a None result', function () {
			expect(None<string>().cloned().isNone).to.be.true;
		});
	});
	describe('or', function () {
		it('should validate or conditions', function () {
			expect(Some(2).or(None()).eq(Some(2))).to.be.true;
			expect(None().or(Some(100)).eq(Some(100))).to.be.true;
			expect(Some(2).or(Some(100)).eq(Some(2))).to.be.true;
			expect(None().or(None()).eq(None())).to.be.true;
		});
	});
	describe('orElse', function () {
		it('should handle or else function', function () {
			expect(
				Some(2)
					.orElse(() => Some(4))
					.eq(Some(2)),
			).to.be.true;
		});
		expect(
			None<number>()
				.orElse(() => Some(4))
				.eq(Some(4)),
		).to.be.true;
	});
	describe('and', function () {
		it('should validate or conditions', function () {
			expect(None().and(None()).eq(None())).to.be.true;
			expect(Some(2).and(None()).eq(None())).to.be.true;
			expect(None().and(Some(100)).eq(None())).to.be.true;
			expect(Some(2).and(Some(100)).eq(Some(100))).to.be.true;
		});
	});
	describe('andThen', function () {
		it('should validate or conditions', function () {
			expect(
				None<number>()
					.andThen((v) => Some(v * 2))
					.eq(None()),
			).to.be.true;
			expect(
				Some<number>(2)
					.andThen((v) => Some(`${v * 2}`))
					.eq(Some('4')),
			).to.be.true;
		});
	});
	describe('replace', function () {
		it('should replace Some Option value', function () {
			const cur = Some(2);
			const old = cur.replace(4);
			expect(cur.eq(Some(4))).to.be.true;
			expect(old.eq(Some(2))).to.be.true;
		});
		it('should replace Some Option value', function () {
			const cur = None<number>();
			const old = cur.replace(4);
			expect(cur.eq(Some(4))).to.be.true;
			expect(old.eq(None())).to.be.true;
		});
	});
	describe('insert', function () {
		it('should replace Some Option value', function () {
			const cur = Some(2);
			const old = cur.insert(4);
			expect(cur.eq(Some(4))).to.be.true;
			expect(old === 4).to.be.true;
		});
		it('should replace Some Option value', function () {
			const cur = None<number>();
			const old = cur.insert(4);
			expect(cur.eq(Some(4))).to.be.true;
			expect(old === 4).to.be.true;
		});
	});
	describe('getOrInsert', function () {
		it('should replace Some Option value', function () {
			const cur = Some(2);
			const value = cur.getOrInsert(4);
			expect(cur.eq(Some(2))).to.be.true;
			expect(value === 2).to.be.true;
		});
		it('should replace Some Option value', function () {
			const cur = None<number>();
			const value = cur.getOrInsert(4);
			expect(cur.eq(Some(4))).to.be.true;
			expect(value === 4).to.be.true;
		});
	});
	describe('toResult', function () {
		it('should convert to Result', function () {
			expect(None<string>().toResult('error').eq(Err<string, string>('error'))).to.be.true;
			expect(Some(2).toResult('error').eq(Ok<number, string>(2))).to.be.true;
		});
	});
	describe('toString', function () {
		it('should convert to Result', function () {
			expect(None<string>().toString()).to.be.eq('None()');
			expect(Some(2).toString()).to.be.eq('Some(2)');
		});
	});
});
