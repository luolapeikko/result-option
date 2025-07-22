import {type IJsonOption} from '../interfaces/IJsonOption.mjs';
import {fromJsonOption, isJsonOption} from './JsonOption.mjs';
import {None} from './None.mjs';
import {type INone, type IOption, type ISome, isOption} from './OptionInstance.mjs';
import {Some} from './Some.mjs';

type ExtractAllSomeType<T> =
	T extends ISome<infer V> ? V : T extends (...args: any[]) => Promise<ISome<infer V>> ? V : T extends (...args: any[]) => ISome<infer V> ? V : never;

type ExtractAllSomeArray<T extends readonly any[]> = {
	[P in keyof T]: ExtractAllSomeType<T[P]>;
};

type AllArgs<T extends IOption<unknown>[]> = {
	[P in keyof T]: T[P] | ((...args: any[]) => T[P]);
};

type AllAsyncArgs<T extends IOption<unknown>[]> = {
	[P in keyof T]: T[P] | Promise<T[P]> | ((...args: any[]) => T[P] | Promise<T[P]>);
};

/**
 * Option with static functions
 * @since v2.0.0
 */
export class Option {
	/**
	 * Get Option from any instance types (Some, None, JsonOption)
	 * @param {ISome<SomeType> | INone | IJsonOption<SomeType>} instance - instance
	 * @returns {ISome<SomeType> | INone}
	 * @since v2.0.0
	 */
	public static from<SomeType>(instance: ISome<SomeType> | INone | IJsonOption<SomeType>): ISome<SomeType> | INone {
		if (isOption(instance)) {
			return instance;
		}
		if (isJsonOption(instance)) {
			return fromJsonOption(instance);
		}
		throw new Error('Invalid Option instance');
	}

	/**
	 * Wrap function to Option function (try-catch)
	 * @example
	 * const bufferFrom = Option.wrapFn(Buffer.from);
	 * const bufferOptionData: IOption<Buffer> = bufferFrom('test', 'utf-8');
	 * @param {(...args: TArgs) => SomeType} func - function
	 * @returns {(...args: TArgs) => IOption<SomeType>}
	 * @since v2.0.0
	 */
	public static wrapFn<TArgs extends any[], SomeType>(func: (...args: TArgs) => SomeType): (...args: TArgs) => IOption<SomeType> {
		return (...args: TArgs): IOption<SomeType> => {
			try {
				return Some(func(...args));
			} catch (_err) {
				return None();
			}
		};
	}

	/**
	 * Wrap Promise function to Promised Option function (try-catch)
	 * @example
	 * const readFile = Options.wrapAsyncFn(fs.promises.readFile);
	 * const fileOption: IOption<string | Buffer> = await readFile('./some.file');
	 * @param {(...args: TArgs) => SomeType | Promise<SomeType>} func - function
	 * @returns {(...args: TArgs) => Promise<IOption<SomeType>>}
	 * @since v2.0.0
	 */
	public static wrapAsyncFn<TArgs extends any[], SomeType>(
		func: (...args: TArgs) => SomeType | Promise<SomeType>,
	): (...args: TArgs) => Promise<IOption<SomeType>> {
		return async (...args: TArgs): Promise<IOption<SomeType>> => {
			try {
				return Some(await func(...args));
			} catch (_err) {
				return None();
			}
		};
	}

	/**
	 * from Number to Some(), nullish and NaN will return None()
	 * @template ValueType extends number
	 * @param {ValueType | null | undefined} value value to wrap
	 * @returns {IOption<ValueType>} - returns Some(value) or None()
	 * @example
	 * Option.fromNum(parseInt(stringNumber, 10)) // returns Some(value) or None()
	 * @since v2.0.0
	 */
	public static fromNum<ValueType extends number>(value: ValueType | null | undefined): IOption<ValueType> {
		return Option.fromNullish(value);
	}

	/**
	 * from any value to Some(), nullish and NaN will return None()
	 * @template ValueType
	 * @param {ValueType | null | undefined} value value to wrap
	 * @returns {IOption<ValueType>} - returns Some(value) or None()
	 * @example
	 * const data: IOption<string> = Option.fromNullish(getStringValueOrNull()) // returns Some(value) or None()
	 * @since v2.0.0
	 */
	public static fromNullish<ValueType>(value: ValueType | null | undefined): IOption<ValueType> {
		if (value === undefined || value === null) {
			return None();
		}
		if (typeof value === 'number' && isNaN(value)) {
			return None();
		}
		return Some(value);
	}

	/**
	 * resolve all options to single ISome array result or INone
	 * @param {AllArgs<T>} args - Array of IOptions or Functions return IOption
	 * @returns {ISome<ExtractAllSomeArray<T>> | INone} - returns ISome<T> or INone
	 * @example
	 * const test1 = (): ISome<string> => Some('hello');
	 * const test2 = (): ISome<number> => Some(10);
	 * const output: ISome<[string, number]> | INone = Option.all(test1, test2);
	 * @since v2.0.0
	 */
	public static all<T extends any[]>(...args: AllArgs<T>): ISome<ExtractAllSomeArray<T>> | INone {
		const output = [] as ExtractAllSomeArray<T>;
		const someList = args.map((arg: IOption<unknown> | ((...args: any[]) => IOption<unknown>)) => (arg instanceof Function ? arg() : arg));
		for (const some of someList) {
			if (some.isNone) {
				return some;
			}
			output.push(some.unwrap());
		}
		return Some<ExtractAllSomeArray<T>>(output);
	}

	/**
	 * resolve all possible async options to single ISome array result or INone
	 * @param {AllAsyncArgs<T>} args - Array of async IOptions or Functions return IOption
	 * @returns {Promise<IResult<ExtractAllOkArray<T>, InferErrValue<T[number]>>>} - returns Promise of ISome<T> or INone
	 * @example
	 * const test1 = (): ISome<string> => Promise.resolve(Some('hello'));
	 * const test2 = (): ISome<number> => Promise.resolve(Some(10));
	 * const output: ISome<[string, number]> | INone = await Option.asyncAll(test1, test2);
	 * @since v2.0.0
	 */
	public static async asyncAll<T extends any[]>(...args: AllAsyncArgs<T>): Promise<ISome<ExtractAllSomeArray<T>> | INone> {
		const output = [] as ExtractAllSomeArray<T>;
		const someList = await Promise.all(args.map((arg: IOption<unknown> | ((...args: any[]) => IOption<unknown>)) => (arg instanceof Function ? arg() : arg)));
		for (const some of someList) {
			if (some.isNone) {
				return some;
			}
			output.push(some.unwrap());
		}
		return Some<ExtractAllSomeArray<T>>(output);
	}

	/* c8 ignore next 3 */
	private constructor() {
		// empty
	}
}
