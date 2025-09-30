import {type ConstructorWithValueOf, type IJsonOk, type IResult, type IResultBuild} from '../interfaces/index.mjs';
import {type ISome, Some} from '../option/index.mjs';
import {isJsonOk} from './JsonResult.mjs';

/**
 * Result Ok instance.
 *
 * Note: this class should not be used directly, use {@link Ok} function instead
 * @template OkType - Ok type
 * @since v1.0.0
 */
export class IOk<OkType> implements IResultBuild<true, OkType, never> {
	private readonly value: OkType;
	public constructor(value: OkType | IJsonOk<OkType>) {
		this.value = isJsonOk<OkType, unknown>(value) ? value.value : value;
	}

	public get isOk(): true {
		return true;
	}

	public isOkAnd(callbackFunc: (value: OkType) => boolean): boolean {
		return callbackFunc(this.value);
	}

	public isErrAnd(_callbackFunc: (value: never) => boolean): false {
		return false;
	}

	public ok(): OkType {
		return this.value;
	}

	public get isErr(): false {
		return false;
	}

	public err(): undefined {
		return undefined;
	}

	public map<NewOkType>(callbackFunc: (val: OkType) => NewOkType): IOk<NewOkType> {
		return new IOk(callbackFunc(this.value));
	}

	public mapErr<NewErrType>(_callbackFunc: (val: never) => NewErrType): this {
		return this;
	}

	public toOption(): ISome<OkType> {
		return Some(this.value);
	}

	public unwrap(): OkType {
		return this.value;
	}

	public unwrapOr<DefaultType>(_defaultValue: DefaultType): OkType {
		return this.value;
	}

	public unwrapOrElse<DefaultType>(_callbackFunc: () => DefaultType): OkType {
		return this.value;
	}

	public unwrapOrValueOf<ValueType>(_constructorValueOf: ConstructorWithValueOf<ValueType>): OkType {
		return this.value;
	}

	public eq(other: IResult): boolean {
		return this.value === other.ok();
	}

	public or<CompareType>(_value: IResult<CompareType>): this {
		return this;
	}

	public orElse<OutResult extends IResult<unknown, unknown>>(_callbackFunc: (value: never) => OutResult): this {
		return this;
	}

	public orElsePromise<OutResult extends IResult<unknown, unknown>>(_callbackFunc: (value: never) => OutResult | Promise<OutResult>): this {
		return this;
	}

	public and<CompareType>(value: IResult<CompareType>): IResult<CompareType> {
		return value;
	}

	public clone(): IOk<OkType> {
		return new IOk(this.value);
	}

	public andThen<OutResult extends IResult<unknown, unknown>>(callbackFunc: (val: OkType) => OutResult): OutResult {
		return callbackFunc(this.value);
	}

	public async andThenPromise<OutResult extends IResult<unknown, unknown>>(callbackFunc: (val: OkType) => OutResult | Promise<OutResult>): Promise<OutResult> {
		return await callbackFunc(this.value);
	}

	public inspect(fn: (value: OkType) => void): this {
		// if we have NodeJS inspect call we return undefined
		/* c8 ignore next 3 */
		if (typeof fn !== 'function') {
			return undefined as unknown as this;
		}
		fn(this.value);
		return this;
	}

	public inspectErr(_fn: (value: never) => void): this {
		return this;
	}

	public *iter(): IterableIterator<this> {
		let isDone = false;
		while (!isDone) {
			yield this;
			isDone = true;
		}
	}

	public toString(): `Ok(${string})` {
		return `Ok(${String(this.value)})`;
	}

	public toJSON(): IJsonOk<OkType> {
		return {
			$class: 'Result::Ok',
			value: this.value,
		};
	}
}
