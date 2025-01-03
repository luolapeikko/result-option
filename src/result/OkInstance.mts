import {type ConstructorWithValueOf, type IJsonOk, type IOk, type IResult, type ResultMatchSolver} from '../interfaces/index.mjs';
import {isJsonOk} from './JsonResult.mjs';
import {Some} from '../option/index.mjs';

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

	public map<OutType>(callbackFunc: (val: OkType) => OutType) {
		return new OkInstance(callbackFunc(this.value));
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
