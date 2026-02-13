import {type ConstructorWithValueOf, type IJsonErr, type IResult, AwaitableIResult, IErrBuilder} from '../interfaces/index.mjs';
import {type INone, None} from '../option/index.mjs';
import { AsyncResult } from './AsyncResult.mjs';
import {isJsonErr} from './JsonResult.mjs';
import { isErr, ResultError } from './ResultError.mjs';

/**
 * Result Err instance.
 *
 * Note: this class should not be used directly, use {@link Err} function instead
 * @template ErrType error type
 * @since v1.0.0
 */
export class IErr<ErrType, OkType = never> implements IErrBuilder<ErrType, OkType> {
	readonly #value: ErrType;
	private originalStack: string | undefined;
	public constructor(error: ErrType | IJsonErr<ErrType>) {
		this.#value = isJsonErr(error) ? error.value : error;
	}

	public get isOk(): false {
		return false;
	}

	public isOkAnd(_callbackFunc: (value: never) => boolean): false {
		return false;
	}

	public isErrAnd(callbackFunc: (value: ErrType) => boolean): boolean {
		return callbackFunc(this.#value);
	}

	public ok(): undefined {
		return undefined;
	}

	public get isErr(): true {
		return true;
	}

	public err(): ErrType {
		return this.#value;
	}

	public toOption(): INone<never> {
		return None<never>();
	}

	public unwrap(): never {
		throw isErr(this.#value) ? new ResultError(this.#value) : this.#value;
	}

	public unwrapOr<DefaultType>(defaultValue: DefaultType): DefaultType {
		return defaultValue;
	}

	public unwrapOrElse<OutType>(orElseCallback: (value: ErrType) => OutType): OutType {
		return orElseCallback(this.#value);
	}

	public unwrapOrValueOf<ValueType>(BaseConstructor: ConstructorWithValueOf<ValueType>): ValueType {
		return new BaseConstructor().valueOf();
	}

	public eq(other: IResult): boolean {
		return this.#value === other.err();
	}

	public or<NextOkType, NextErrType>(other: IResult<NextOkType, NextErrType>): IResult<OkType | NextOkType, NextErrType>;
	public or<NextOkType, NextErrType>(other: Promise<IResult<NextOkType, NextErrType>>): AsyncResult<OkType | NextOkType, NextErrType>;
	public or<NextOkType, NextErrType>(
		other: AwaitableIResult<NextOkType, NextErrType>,
	): IResult<OkType | NextOkType, NextErrType> | AsyncResult<OkType | NextOkType, NextErrType> {
		const next = other;
		if (next instanceof Promise) {
			return new AsyncResult<OkType | NextOkType, NextErrType>(next);
		}
		return next;
	}

	public orElse<NextOkType, NextErrType = never>(cb: (value: ErrType) => IResult<NextOkType, NextErrType>): IResult<OkType | NextOkType, NextErrType>;
	public orElse<NextOkType, NextErrType = never>(cb: (value: ErrType) => Promise<IResult<NextOkType, NextErrType>>): AsyncResult<OkType | NextOkType, NextErrType>;
	public orElse<NextOkType, NextErrType = never>(
		cb: (value: ErrType) => AwaitableIResult<NextOkType, NextErrType>,
	): IResult<OkType | NextOkType, NextErrType> | AsyncResult<OkType | NextOkType, NextErrType> {
		const next = cb(this.#value);
		if (next instanceof Promise) {
			return new AsyncResult<OkType | NextOkType, NextErrType>(next);
		}
		return next;
	}

	public and<NextOkType, NextErrType>(_other: IResult<NextOkType, NextErrType>): IErrBuilder<ErrType, NextOkType | OkType>;
	public and<NextOkType, NextErrType>(_other: Promise<IResult<NextOkType, NextErrType>>): Promise<IErrBuilder<ErrType, NextOkType | OkType>>;
	public and<NextOkType, NextErrType>(_other: AwaitableIResult<NextOkType, NextErrType>): IErrBuilder<ErrType, NextOkType | OkType> | Promise<IErrBuilder<ErrType, NextOkType | OkType>> {
		return this;
	}

	public clone(): IErr<ErrType> {
		return new IErr(this.#value);
	}

	public andThen<NextOkType, NextErrType>(_cb: (value: OkType) => IResult<NextOkType, NextErrType>): IErrBuilder<ErrType, NextOkType | OkType>;
	public andThen<NextOkType, NextErrType>(_cb: (value: OkType) => Promise<IResult<NextOkType, NextErrType>>): Promise<IErrBuilder<ErrType, NextOkType | OkType>>;
	public andThen<NextOkType, NextErrType>(_cb: (value: OkType) => AwaitableIResult<NextOkType, NextErrType>): IErrBuilder<ErrType, NextOkType | OkType> | Promise<IErrBuilder<ErrType, NextOkType | OkType>> {
		return this;
	}

	public map<NewOkType>(_callbackFunc: (val: never) => NewOkType): this {
		return this;
	}

	public mapErr<NewErrType>(fn: (value: ErrType) => NewErrType): IErr<NewErrType> {
		return new IErr(fn(this.#value));
	}

	public inspectOk(_fn: (value: never) => void): this {
		return this;
	}

	public inspectErr(fn: (value: ErrType) => void): this {
		fn(this.#value);
		return this;
	}

	public *iter(): IterableIterator<INone<never>> {
		let isDone = false;
		while (!isDone) {
			yield None();
			isDone = true;
		}
	}

	public toString(): `Err(${string})` {
		return `Err(${this.getErrorInstanceName()}${this.getErrorInstanceMessage()})`;
	}

	public toJSON(): IJsonErr<ErrType> {
		return {
			$class: 'Result::Err',
			value: this.#value,
		};
	}

	private getErrorInstanceName(): string {
		if (typeof this.#value === 'object' && this.#value !== null) {
			return this.#value.constructor.name;
		}
		return 'UnknownErrorInstance';
	}

	private getErrorInstanceMessage(): string {
		if (this.#value instanceof Error) {
			return `: '${this.#value.message}'`;
		}
		return `: '${JSON.stringify(this.#value)}'`;
	}
}
