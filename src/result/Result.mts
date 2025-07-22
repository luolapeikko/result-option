import {type IJsonErr, type IJsonOk, type IResult, type IResultOrOkType} from '../interfaces/index.mjs';
import {resultAsyncFlow} from './asyncFlow.mjs';
import {Err} from './Err.mjs';
import {type IErr} from './ErrInstance.mjs';
import {resultFlow} from './flow.mjs';
import {fromJsonResult, isJsonResult} from './JsonResult.mjs';
import {Ok} from './Ok.mjs';
import {type IOk} from './OkInstance.mjs';
import {isResult} from './ResultInstance.mjs';

type Res = IResult<unknown, unknown>;

type ExtractAllOkType<T> =
	T extends IOk<infer V> ? V : T extends (...args: any[]) => Promise<IOk<infer V>> ? V : T extends (...args: any[]) => IOk<infer V> ? V : never;
type ExtractAllErrType<T> =
	T extends IErr<infer V> ? V : T extends (...args: any[]) => Promise<IErr<infer V>> ? V : T extends (...args: any[]) => IErr<infer V> ? V : never;

type ExtractAllOkArray<T extends readonly any[]> = {
	[P in keyof T]: ExtractAllOkType<T[P]>;
};

type AllArgs<T extends IResult<unknown, unknown>[]> = {
	[P in keyof T]: T[P] | ((...args: any[]) => T[P]);
};

type AllAsyncArgs<T extends IResult<unknown, unknown>[]> = {
	[P in keyof T]: T[P] | Promise<T[P]> | ((...args: any[]) => T[P] | Promise<T[P]>);
};

/**
 * Promise.allSettled wrapper for Result
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
 * @param {Promise<IResultOrOkType<OkType, ErrType>>} callPromise
 * @returns {Promise<IResult<OkType, ErrType>>}
 */
async function promiseSettledAsResult<OkType = unknown, ErrType = unknown>(
	callPromise: Promise<IResultOrOkType<OkType, ErrType>>,
): Promise<IResult<OkType, ErrType>> {
	const result = (await Promise.allSettled([callPromise]))[0];
	if (result.status === 'fulfilled') {
		return Ok(result.value);
	} else {
		return Err(result.reason as ErrType);
	}
}

/**
 * Result with static functions
 * @since v2.0.0
 */
export class Result {
	/**
	 * Run a flow of callback results
	 * @example
	 * const res: IResult<string> = resultFlow(
	 *   Ok('hello'),
	 *   (value) => Ok(`${value} world`),
	 *   (value) => Ok(value.length),
	 *   (value) => Ok(value.toString()),
	 * );
	 * @template A type of the initial result
	 * @param {A} v initial result
	 * @returns {IResult} as final result
	 * @throws {Error} if uncontrolled error from callback
	 * @since v2.0.0
	 */
	public static readonly flow: typeof resultFlow = resultFlow;

	/**
	 * Run a flow of async and sync callback results
	 * @template A type of the initial result
	 * @param {A} v initial result
	 * @returns {IResult} as final result
	 * @throws {Error} if uncontrolled error from callback
	 * @example
	 * const res: Promise<IResult<string>> = resultAsyncFlow(
	 *   Ok('hello'),
	 *   (value) => Promise.resolve(Ok(`${value} world`)),
	 *   (value) => Ok(value.length),
	 *   (value) => Ok(value.toString()),
	 * );
	 * @since v2.0.0
	 */
	public static readonly asyncFlow: typeof resultAsyncFlow = resultAsyncFlow;

	/**
	 * Build IResult from IResult or IJsonResult.
	 * @template OkType return type
	 * @template ErrType error type
	 * @param {IOk<OkType> | IErr<ErrType> | IJsonOk<OkType> | IJsonErr<ErrType>} value - any IResult or JsonResult as IResult
	 * @returns {IResult<OkType, ErrType>} IResult
	 * @since v2.0.0
	 */
	public static from<OkType = unknown, ErrType = unknown>(value: IOk<OkType> | IErr<ErrType> | IJsonOk<OkType> | IJsonErr<ErrType>): IResult<OkType, ErrType> {
		if (isResult(value)) {
			return value;
		}
		if (isJsonResult(value)) {
			return fromJsonResult<OkType, ErrType>(value);
		}
		throw new TypeError(`Invalid Result type: ${JSON.stringify(value)}`);
	}

	/**
	 * Resolve all results to single IOk array result or IErr
	 * @example
	 * const test1 = (): IResult<string, Error> => Ok('hello');
	 * const test2 = (): IResult<number, Error> => Ok(10);
	 * const output: IResult<[string, number], Error> = Result.all(test1, test2);
	 * @param {AllArgs<T>} args - Array of IResult or Functions return IResult
	 * @returns {IResult<ExtractAllOkArray<T>, InferErrValue<T[number]>>} - returns IOk or IErr
	 * @since v2.0.0
	 */
	public static all<T extends any[]>(...args: AllArgs<T>): IResult<ExtractAllOkArray<T>, ExtractAllErrType<T[number]>> {
		const output = [] as ExtractAllOkArray<T>;
		const results = args.map((arg: Res | ((...args: any[]) => Res)) => (arg instanceof Function ? arg() : arg));
		for (const res of results) {
			if (res.isErr) {
				return res as IErr<ExtractAllErrType<T[number]>>;
			}
			output.push(res.ok());
		}
		return Ok<ExtractAllOkArray<T>>(output);
	}

	/**
	 * Resolve all possible async results to single IOk array result or IErr (like Promise.all but returns as result Result)
	 * @example
	 * const test1 = (): Promise<IResult<string, Error>> => Promise.resolve(Ok('hello'));
	 * const test2 = (): Promise<IResult<number, Error>> => Promise.resolve(Ok(10));
	 * const output: IResult<[string, number], Error> = await Result.all(test1, test2);
	 * @param {AllAsyncArgs<T>} args - Array of async IResult or Functions return async IResult
	 * @returns {Promise<IResult<ExtractAllOkArray<T>, InferErrValue<T[number]>>>} - returns Promise of IOk or IErr
	 * @since v2.0.0
	 */
	public static async asyncAll<T extends any[]>(...args: AllAsyncArgs<T>): Promise<IResult<ExtractAllOkArray<T>, ExtractAllErrType<T[number]>>> {
		const output = [] as ExtractAllOkArray<T>;
		const results = await Promise.all(args.map((arg: Res | ((...args: any[]) => Res)) => (arg instanceof Function ? arg() : arg)));
		for (const res of results) {
			if (res.isErr) {
				return res as IErr<ExtractAllErrType<T[number]>>;
			}
			output.push(res.ok());
		}
		return Ok<ExtractAllOkArray<T>>(output);
	}

	/**
	 * build safe Result wrapper for callback function
	 * @example
	 * const hello = Result.wrapFn((value: string) => `${value} world`);
	 * // hello: (value: string) => IResult<string, unknown>
	 * // example of strict generics usage (to set correct error type)
	 * const jsonParse = Result.wrapFn<Parameters<typeof JSON.parse>, ReturnType<typeof JSON.parse>, SyntaxError>(JSON.parse);
	 * const res: IResult<any, SyntaxError> = jsonParse('{ "hello": "world" }');
	 * @template TArgs function arguments
	 * @template OkType return type
	 * @template ErrType error type
	 * @param {(...args: TArgs) => IResultOrOkType<OkType, ErrType>} func callback function
	 * @returns {(...args: TArgs) => IResult<OkType, ErrType>} wrapped function which returns Result
	 * @since v2.0.0
	 */
	public static wrapFn<TArgs extends any[], OkType, ErrType>(
		func: (...args: TArgs) => IResultOrOkType<OkType, ErrType>,
	): (...args: TArgs) => IResult<OkType, ErrType> {
		return (...args: TArgs): IResult<OkType, ErrType> => {
			try {
				const data = func(...args);
				if (isResult(data)) {
					return data;
				}
				return Ok(data);
			} catch (err) {
				return Err(err as ErrType);
			}
		};
	}

	/**
	 * build safe Result wrapper for async callback function
	 * @example
	 * const writeFile = Result.wrapAsyncFn<Parameters<typeof fs.promises.writeFile>, void, Error>(fs.promises.writeFile);
	 * const result: IResult<void, Error> = await writeFile('test.txt', 'hello world');
	 * @template TArgs function arguments
	 * @template OkType return type
	 * @template ErrType error type
	 * @param {(...args: TArgs) => Promise<IResultOrOkType<OkType, ErrType>>} func async Promise or callback function
	 * @returns {(...args: TArgs) => Promise<IResult<OkType, ErrType>>} wrapped function which returns Result Promise
	 * @since v2.0.0
	 */
	public static wrapAsyncFn<TArgs extends any[], OkType, ErrType>(
		func: (...args: TArgs) => Promise<IResultOrOkType<OkType, ErrType>>,
	): (...args: TArgs) => Promise<IResult<OkType, ErrType>> {
		return async (...args: TArgs): Promise<IResult<OkType, ErrType>> => {
			try {
				return promiseSettledAsResult(func(...args));
				/* c8 ignore next 3 */
			} catch (err) {
				return Err(err as ErrType);
			}
		};
	}

	/**
	 * function to match the value or error
	 * @example
	 * Result.match(Ok<number>(2), {
	 * 	Ok: (value) => value * 2,
	 * 	Err: (err) => 0
	 * }) // 4
	 * Result.match(Err<number>(2), {
	 * 	Ok: (value) => value * 2,
	 * 	Err: (err) => 0
	 * }) // 0
	 * @template OkType - Ok type
	 * @template ErrType - Err type
	 * @template OkOutput - output type from Ok
	 * @template ErrOutput - output type from Err
	 * @param {IResult<OkType, ErrType>} result - result to match
	 * @param {{Ok: (value: OkType) => OkOutput, Err: (err: ErrType) => ErrOutput}} solver - solver callback
	 * @returns {OkOutput | ErrOutput} output
	 * @since v2.0.0
	 */
	public static match<OkType, ErrType, OkOutput, ErrOutput>(
		result: IResult<OkType, ErrType>,
		solver: {
			Ok: (value: OkType) => OkOutput;
			Err: (err: ErrType) => ErrOutput;
		},
	): OkOutput | ErrOutput {
		if (result.isOk) {
			return solver.Ok(result.ok());
		} else {
			return solver.Err(result.err());
		}
	}

	/**
	 * Function to match the value or error with try catch
	 * @example
	 * const result = Result.safeCall<unknown, SyntaxError>(() => JSON.parse('{ "hello": "world" }'));
	 * @template OkType - Ok type
	 * @template ErrType - Err type
	 * @param {() => IResultOrOkType<OkType, ErrType>} func - callback function
	 * @returns {IResult<OkType, ErrType>} result
	 * @since v2.0.1
	 */
	public static safeCall<OkType, ErrType>(func: () => IResultOrOkType<OkType, ErrType>): IResult<OkType, ErrType> {
		try {
			const data = func();
			if (isResult(data)) {
				return data;
			}
			return Ok(data);
		} catch (err) {
			return Err(err as ErrType);
		}
	}

	/**
	 * Async function to match the value or error with try catch
	 * @example
	 * const result = await Result.safeAsyncCall<unknown, SyntaxError>(() => JSON.parse('{ "hello": "world" }'));
	 * @template OkType - Ok type
	 * @template ErrType - Err type
	 * @param {() => IResultOrOkType<OkType, ErrType>} func - callback function
	 * @returns {IResult<OkType, ErrType>} result
	 * @since v2.0.1
	 */
	public static async safeAsyncCall<OkType, ErrType>(
		func: () => IResultOrOkType<OkType, ErrType> | Promise<IResultOrOkType<OkType, ErrType>>,
	): Promise<IResult<OkType, ErrType>> {
		try {
			const data = await func();
			if (isResult(data)) {
				return data;
			}
			return Ok(data);
		} catch (err) {
			return Err(err as ErrType);
		}
	}

	/* c8 ignore next 3 */
	private constructor() {
		// empty
	}
}
