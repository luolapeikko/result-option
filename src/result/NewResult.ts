import {type ConstructorWithValueOf} from '../interfaces/index.mjs';
import {I, E} from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';
/**
 * MappedType is a type that maps a boolean to a type.
 * @since v1.0.0
 */
export type MappedType<IsTrue extends boolean, TrueType, FalseType> = {true: TrueType; false: FalseType}[`${IsTrue}`];

/**
 * function to resolve the mapped type
 * @param {IsTrue} isTrue - boolean to resolve the type
 * @param {TrueType} trueValue - type to return if isTrue is true
 * @param {FalseType} falseValue - type to return if isTrue is false
 * @returns {MappedType<IsTrue, TrueType, FalseType>}
 * @since v1.0.0
 */
export function asMapped<IsTrue extends boolean, TrueType, FalseType>(
	isTrue: IsTrue,
	trueValue: TrueType,
	falseValue: FalseType,
): MappedType<IsTrue, TrueType, FalseType> {
	return {true: trueValue, false: falseValue}[`${isTrue}`];
}

export interface ICErr<ErrType, OkType> {
	isOk: false;
	isErr: true;
	unwrap(): OkType;
	unwrapErr(): ErrType;
	err(): ErrType;
	ok(): undefined;
	isOkAnd(callbackFunc: (value: OkType) => boolean): boolean;
	isErrAnd(callbackFunc: (value: ErrType) => boolean): boolean;
	unwrapOr<DefaultType>(defaultValue: DefaultType): DefaultType;
	unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType): DefaultType;
	unwrapOrValueOf<DefaultType>(BaseConstructor: ConstructorWithValueOf<DefaultType>): DefaultType;
	eq(other: ICResult): boolean;
	and<DefaultResult extends ICResult>(value: DefaultResult): this;
	andThen<DefaultResult extends ICResult>(callbackFunc: (val: OkType) => DefaultResult): this;
	andThenPromise<DefaultResult extends ICResult>(callbackFunc: (val: OkType) => Promise<DefaultResult>): this;
	or<DefaultResult extends ICResult>(value: DefaultResult): DefaultResult;
	orElse<DefaultResult extends ICResult>(callbackFunc: (value: ErrType) => DefaultResult): DefaultResult;
	orElsePromise<DefaultResult extends ICResult>(callbackFunc: (value: ErrType) => Promise<DefaultResult>): Promise<DefaultResult>;
	clone(): ICErr<ErrType, OkType>;
	map<DefaultType>(callbackFunc: (value: OkType) => DefaultType): this;
	mapErr<NewErrType>(callbackFunc: (value: ErrType) => NewErrType): ICErr<NewErrType, OkType>;
	inspect(fn: (value: OkType) => void): this;
	inspectErr(fn: (value: ErrType) => void): this;
}

export interface ICOk<OkType, ErrType> {
	isOk: true;
	isErr: false;
	unwrap(): OkType;
	unwrapErr(): ErrType;
	err(): undefined;
	ok(): OkType;
	isOkAnd(callbackFunc: (value: OkType) => boolean): boolean;
	isErrAnd(callbackFunc: (value: ErrType) => boolean): boolean;
	unwrapOr<DefaultType>(defaultValue: DefaultType): OkType;
	unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType): OkType;
	unwrapOrValueOf<DefaultType>(BaseConstructor: ConstructorWithValueOf<DefaultType>): OkType;
	eq(other: ICResult): boolean;
	and<DefaultResult extends ICResult>(value: DefaultResult): DefaultResult;
	andThen<DefaultResult extends ICResult<unknown, unknown>>(callbackFunc: (val: OkType) => DefaultResult): DefaultResult;
	andThenPromise<DefaultResult extends ICResult>(callbackFunc: (val: OkType) => Promise<DefaultResult>): Promise<DefaultResult>;
	or<DefaultResult extends ICResult>(value: DefaultResult): this;
	orElse<DefaultResult extends ICResult>(callbackFunc: (value: ErrType) => DefaultResult): this;
	orElsePromise<DefaultResult extends ICResult>(callbackFunc: (value: ErrType) => Promise<DefaultResult>): this;
	clone(): ICOk<OkType, ErrType>;
	map<DefaultType>(callbackFunc: (value: OkType) => DefaultType): ICOk<DefaultType, ErrType>;
	mapErr<NewErrType>(callbackFunc: (value: ErrType) => NewErrType): this;
	inspect(fn: (value: OkType) => void): this;
	inspectErr(fn: (value: ErrType) => void): this;
}

export interface ICResult<OkType = unknown, ErrType = unknown> {
	isOk: boolean;
	isErr: boolean;
	unwrap(): OkType;
	unwrapErr(): ErrType;
	err(): ErrType | undefined;
	ok(): OkType | undefined;
	isOkAnd(callbackFunc: (value: OkType) => boolean): boolean;
	isErrAnd(callbackFunc: (value: ErrType) => boolean): boolean;
	unwrapOr<DefaultType>(defaultValue: DefaultType): DefaultType | OkType;
	unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType): DefaultType | OkType;
	unwrapOrValueOf<DefaultType>(BaseConstructor: ConstructorWithValueOf<DefaultType>): DefaultType | OkType;
	eq(other: ICResult): boolean;
	and<DefaultResult extends ICResult>(value: DefaultResult): DefaultResult | this;
	andThen<DefaultResult extends ICResult>(callbackFunc: (val: OkType) => DefaultResult): DefaultResult | this;
	andThenPromise<DefaultResult extends ICResult>(callbackFunc: (val: OkType) => Promise<DefaultResult>): Promise<DefaultResult> | this;
	or<DefaultResult extends ICResult>(value: DefaultResult): DefaultResult | this;
	orElse<DefaultResult extends ICResult>(callbackFunc: (value: ErrType) => DefaultResult): DefaultResult | this;
	orElsePromise<DefaultResult extends ICResult>(callbackFunc: (value: ErrType) => Promise<DefaultResult>): Promise<DefaultResult> | this;
	clone(): ICResult<OkType, ErrType>;
	map<DefaultType>(callbackFunc: (value: OkType) => DefaultType): this | ICOk<DefaultType, ErrType>;
	mapErr<NewErrType>(callbackFunc: (value: ErrType) => NewErrType): ICErr<NewErrType, OkType> | this;
	inspect(fn: (value: OkType) => void): this;
	inspectErr(fn: (value: ErrType) => void): this;
}

export class CBuildResult<IsOk extends boolean, OkType = unknown, ErrType = unknown> implements ICResult<OkType, ErrType> {
	#isOk: IsOk;
	#okValue: OkType | undefined;
	#errValue: ErrType | undefined;
	public constructor(isOk: true, okValue: OkType, errValue: ErrType | undefined);
	public constructor(isOk: false, okValue: OkType | undefined, errValue: ErrType);
	public constructor(isOk: boolean, okValue: OkType | undefined, errValue: ErrType | undefined);
	public constructor(isOk: IsOk, okValue: OkType | undefined, errValue: ErrType | undefined) {
		this.#isOk = isOk;
		if (isOk) {
			this.#okValue = okValue as OkType;
		} else {
			this.#errValue = errValue as ErrType;
		}
	}
	public get isOk() {
		return this.#isOk;
	}

	public isOkAnd(callbackFunc: (value: OkType) => boolean): boolean {
		if (this.#isOk) {
			return callbackFunc(this.unwrap());
		}
		return false;
	}

	public isErrAnd(callbackFunc: (value: ErrType) => boolean): boolean {
		if (!this.#isOk) {
			return callbackFunc(this.unwrapErr());
		}
		return false;
	}

	public get isErr() {
		return !this.#isOk;
	}
	public err(): ErrType | undefined {
		return this.#errValue;
	}

	public ok(): OkType | undefined {
		return this.#okValue;
	}

	public unwrap(): OkType {
		if (!this.#isOk) {
			throw this.#errValue;
		}
		return this.#okValue as OkType;
	}
	public unwrapErr(): ErrType {
		if (this.#isOk) {
			throw this.#okValue;
		}
		return this.#errValue as ErrType;
	}

	public unwrapOr<DefaultType>(defaultValue: DefaultType): DefaultType | OkType {
		if (this.#isOk) {
			return this.unwrap();
		}
		return defaultValue;
	}

	public unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType): DefaultType | OkType {
		if (this.#isOk) {
			return this.unwrap();
		}
		return callbackFunc();
	}
	public unwrapOrValueOf<DefaultType>(BaseConstructor: ConstructorWithValueOf<DefaultType>): DefaultType | OkType {
		if (this.#isOk) {
			return this.unwrap();
		}
		return new BaseConstructor().valueOf();
	}
	public eq(other: ICResult): boolean {
		if (this.isOk && other.isOk) {
			return this.ok() === other.ok();
		}
		if (this.isErr && other.isErr) {
			return this.err() === other.err();
		}
		return false;
	}
	public and<DefaultResult extends ICResult>(value: DefaultResult): DefaultResult | this {
		if (this.#isOk) {
			return value;
		}
		return this;
	}
	public andThen<DefaultResult extends ICResult>(callbackFunc: (val: OkType) => DefaultResult): DefaultResult | this {
		if (this.#isOk) {
			return callbackFunc(this.unwrap());
		}
		return this;
	}
	public andThenPromise<DefaultResult extends ICResult>(callbackFunc: (val: OkType) => Promise<DefaultResult>): Promise<DefaultResult> | this {
		if (this.#isOk) {
			return callbackFunc(this.unwrap());
		}
		return this;
	}
	public or<DefaultResult extends ICResult>(value: DefaultResult): DefaultResult | this {
		if (this.#isOk) {
			return this;
		}
		return value;
	}
	public orElse<DefaultResult extends ICResult>(callbackFunc: (value: ErrType) => DefaultResult): DefaultResult | this {
		if (this.#isOk) {
			return this;
		}
		return callbackFunc(this.unwrapErr());
	}
	public orElsePromise<DefaultResult extends ICResult>(callbackFunc: (value: ErrType) => Promise<DefaultResult>): Promise<DefaultResult> | this {
		if (this.#isOk) {
			return this;
		}
		return callbackFunc(this.unwrapErr());
	}
	public clone(): ICResult<OkType, ErrType> {
		return new CBuildResult(this.#isOk, this.#okValue, this.#errValue);
	}
	public map<DefaultType>(callbackFunc: (value: OkType) => DefaultType): this | ICOk<DefaultType, ErrType> {
		if (this.#isOk) {
			return new CBuildResult(true, callbackFunc(this.unwrap()), this.unwrapErr()) as ICOk<DefaultType, ErrType>;
		}
		return this;
	}
	public mapErr<NewErrType>(callbackFunc: (value: ErrType) => NewErrType): this | ICErr<NewErrType, OkType> {
		if (!this.#isOk) {
			return new CBuildResult(false, this.unwrap(), callbackFunc(this.unwrapErr())) as ICErr<NewErrType, OkType>;
		}
		return this;
	}

	public inspect(fn: (value: OkType) => void): this {
		// if we have NodeJS inspect call we return undefined
		/* c8 ignore next 3 */
		if (typeof fn !== 'function') {
			return undefined as unknown as this;
		}
		if (this.#isOk) {
			fn(this.unwrap());
		}
		return this;
	}

	public inspectErr(fn: (value: ErrType) => void): this {
		// if we have NodeJS inspect call we return undefined
		/* c8 ignore next 3 */
		if (typeof fn !== 'function') {
			return undefined as unknown as this;
		}
		if (!this.#isOk) {
			fn(this.unwrapErr());
		}
		return this;
	}
}
