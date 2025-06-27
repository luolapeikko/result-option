import {type ConstructorWithValueOf, type IJsonOk, type IOk, type IResult, type ResultMatchSolver} from '../interfaces/index.mjs';
import {Some} from '../option/index.mjs';
import {isJsonOk} from './JsonResult.mjs';

/**
 * Ok Result instance
 * @template OkType - Ok type
 * @since v1.0.0
 */
export class OkInstance<OkType> implements IOk<OkType> {
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

	public ok() {
		return this.value;
	}

	public get isErr(): false {
		return false;
	}

	public err(): undefined {
		return undefined;
	}

	public match<OkOutput, ErrOutput>(solver: ResultMatchSolver<OkType, unknown, OkOutput, ErrOutput>) {
		return solver.Ok(this.value);
	}

	public map<NewOkType>(callbackFunc: (val: OkType) => NewOkType): OkInstance<NewOkType> {
		return new OkInstance(callbackFunc(this.value));
	}

	public mapErr<NewErrType>(_callbackFunc: (val: never) => NewErrType): OkInstance<OkType> {
		return this;
	}

	public toOption() {
		return Some(this.value);
	}

	public unwrap(_err?: Error | ((err: never) => Error)) {
		return this.value;
	}

	public unwrapOr<DefaultType>(_defaultValue: DefaultType) {
		return this.value;
	}

	public unwrapOrElse<DefaultType>(_callbackFunc: () => DefaultType) {
		return this.value;
	}

	public unwrapOrValueOf<ValueType>(_constructorValueOf: ConstructorWithValueOf<ValueType>) {
		return this.value;
	}

	public eq(other: IResult) {
		return this.value === other.ok();
	}

	public or<CompareType>(_value: IResult<CompareType>) {
		return this;
	}

	public orElse<CompareType, Override>(_callbackFunc: (value: Override) => IResult<CompareType>) {
		return this;
	}

	public and<CompareType>(value: IResult<CompareType>) {
		return value;
	}

	public clone() {
		return new OkInstance(this.value);
	}

	public andThen<OutType>(callbackFunc: (val: OkType) => IResult<OutType>) {
		return callbackFunc(this.value);
	}

	public inspect(fn: (value: OkType) => void): this {
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
