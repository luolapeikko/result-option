import {type ConstructorWithValueOf, type IJsonOk, type IOk, type IResult, type ResultMatchSolver} from '../interfaces/index.mjs';
import {type ISome, Some} from '../option/index.mjs';
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

	public ok(): OkType {
		return this.value;
	}

	public get isErr(): false {
		return false;
	}

	public err(): undefined {
		return undefined;
	}

	public match<OkOutput, ErrOutput>(solver: ResultMatchSolver<OkType, unknown, OkOutput, ErrOutput>): OkOutput {
		return solver.Ok(this.value);
	}

	public map<NewOkType>(callbackFunc: (val: OkType) => NewOkType): OkInstance<NewOkType> {
		return new OkInstance(callbackFunc(this.value));
	}

	public mapErr<NewErrType>(_callbackFunc: (val: never) => NewErrType): OkInstance<OkType> {
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

	public orElse<CompareType, Override>(_callbackFunc: (value: Override) => IResult<CompareType>): this {
		return this;
	}

	public and<CompareType>(value: IResult<CompareType>): IResult<CompareType> {
		return value;
	}

	public clone(): OkInstance<OkType> {
		return new OkInstance(this.value);
	}

	public andThen<OutType>(callbackFunc: (val: OkType) => IResult<OutType>): IResult<OutType> {
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
