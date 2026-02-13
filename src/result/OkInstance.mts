import {AwaitableIResult, IOkBuilder, type ConstructorWithValueOf, type IJsonOk, type IResult} from '../interfaces/index.mjs';
import {type ISome, Some} from '../option/index.mjs';
import { AsyncResult } from './AsyncResult.mjs';
import {isJsonOk} from './JsonResult.mjs';

/**
 * Result Ok instance.
 *
 * Note: this class should not be used directly, use {@link Ok} function instead
 * @template OkType - Ok type
 * @since v1.0.0
 */
export class IOk<OkType, ErrType = never> implements IOkBuilder<OkType, ErrType> {
	readonly #value: OkType;
	public constructor(value: OkType | IJsonOk<OkType>) {
		this.#value = isJsonOk<OkType, unknown>(value) ? value.value : value;
	}

	public get isOk(): true {
		return true;
	}

	public isOkAnd(callbackFunc: (value: OkType) => boolean): boolean {
		return callbackFunc(this.#value);
	}

	public isErrAnd(_callbackFunc: (value: never) => boolean): false {
		return false;
	}

	public ok(): OkType {
		return this.#value;
	}

	public get isErr(): false {
		return false;
	}

	public err(): undefined {
		return undefined;
	}

	public map<NewOkType>(callbackFunc: (val: OkType) => NewOkType): IOk<NewOkType> {
		return new IOk(callbackFunc(this.#value));
	}

	public mapErr<NewErrType>(_callbackFunc: (val: never) => NewErrType): this {
		return this;
	}

	public toOption(): ISome<OkType> {
		return Some(this.#value);
	}

	public unwrap(): OkType {
		return this.#value;
	}

	public unwrapOr<DefaultType>(_defaultValue: DefaultType): OkType {
		return this.#value;
	}

	public unwrapOrElse<OutType>(_orElseCallback: (value: ErrType) => OutType): OkType {
		return this.#value;
	}

	public unwrapOrValueOf<ValueType>(_constructorValueOf: ConstructorWithValueOf<ValueType>): OkType {
		return this.#value;
	}

	public eq(other: IResult): boolean {
		return this.#value === other.ok();
	}

	public or<NextOkType, NextErrType>(_other: IResult<NextOkType, NextErrType>): this;
	public or<NextOkType, NextErrType>(_other: Promise<IResult<NextOkType, NextErrType>>): Promise<this>;
	public or<NextOkType, NextErrType>(_other: AwaitableIResult<NextOkType, NextErrType>): this | Promise<this> {
		return this;
	}

	public orElse<NextOkType, NextErrType = never>(_orElseCallback: (value: ErrType) => IResult<NextOkType, NextErrType>): this;
	public orElse<NextOkType, NextErrType = never>(_orElseCallback: (value: ErrType) => Promise<IResult<NextOkType, NextErrType>>): Promise<this>;
	public orElse<NextOkType, NextErrType = never>(_orElseCallback: (value: ErrType) => AwaitableIResult<NextOkType, NextErrType>): this | Promise<this> {
		return this;
	}

	public and<NxOkType, NxErrType>(other: IResult<NxOkType, NxErrType>): IResult<NxOkType, ErrType | NxErrType>;
	public and<NxOkType, NxErrType>(other: Promise<IResult<NxOkType, NxErrType>>): AsyncResult<NxOkType, ErrType | NxErrType>;
	public and<NxOkType, NxErrType>(
		other: IResult<NxOkType, NxErrType> | Promise<IResult<NxOkType, NxErrType>>,
	): IResult<NxOkType, ErrType | NxErrType> | AsyncResult<NxOkType, ErrType | NxErrType> {
		if (other instanceof Promise) {
			return new AsyncResult<NxOkType, ErrType | NxErrType>(other);
		}
		return other;
	}

	public clone(): IOk<OkType> {
		return new IOk(this.#value);
	}

	public andThen<NxOkType, NxErrType = never>(cb: (value: OkType) => IResult<NxOkType, NxErrType>): IResult<NxOkType, ErrType | NxErrType>;
	public andThen<NxOkType, NxErrType = never>(cb: (value: OkType) => Promise<IResult<NxOkType, NxErrType>>): AsyncResult<NxOkType, ErrType | NxErrType>;
	public andThen<NxOkType, NxErrType = never>(
		cb: (value: OkType) => IResult<NxOkType, NxErrType> | Promise<IResult<NxOkType, NxErrType>>,
	): IResult<NxOkType, ErrType | NxErrType> | AsyncResult<NxOkType, ErrType | NxErrType> {
		const next = cb(this.#value);
		if (next instanceof Promise) {
			return new AsyncResult<NxOkType, ErrType | NxErrType>(next);
		}
		return next;
	}

	public inspectOk(fn: (value: OkType) => void): this {
		fn(this.#value);
		return this;
	}

	public inspectErr(_fn: (value: never) => void): this {
		return this;
	}

	public *iter(): IterableIterator<ISome<OkType>> {
		let isDone = false;
		while (!isDone) {
			yield this.toOption();
			isDone = true;
		}
	}

	public toString(): `Ok(${string})` {
		return `Ok(${String(this.#value)})`;
	}

	public toJSON(): IJsonOk<OkType> {
		return {
			$class: 'Result::Ok',
			value: this.#value,
		};
	}
}
