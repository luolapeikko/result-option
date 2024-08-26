import {type IOk, type IResult, type ConstructorWithValueOf, type IJsonOk, type ResultMatchSolver} from '../interfaces/index.js';
import {type ISome, Some} from '../option/index.js';

export class OkInstance<OkType, ErrType> implements IOk<OkType, ErrType> {
	private readonly value: OkType;
	readonly isOk = true;
	readonly isErr = false;
	public constructor(value: OkType) {
		this.value = value;
	}

	public ok(): OkType {
		return this.value;
	}

	public err(): undefined {
		return undefined;
	}

	public match<OkOutput, ErrOutput>(solver: ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput>): OkOutput {
		return solver.Ok(this.value);
	}

	public toOption(): ISome<OkType> {
		return Some(this.value);
	}

	public unwrap(_err?: ((err: ErrType) => Error) | undefined): OkType {
		return this.value;
	}

	public unwrapOr<DefaultType>(_defaultValue: DefaultType): OkType {
		return this.value;
	}

	public unwrapOrElse<DefaultType>(_callbackFunc: () => DefaultType): OkType {
		return this.value;
	}

	public unwrapOrValueOf(_constructorValueOf: ConstructorWithValueOf<OkType>): OkType {
		return this.value;
	}

	public eq<EqualsType extends IResult>(other: EqualsType): boolean {
		return this.value === other.ok();
	}

	public or<CompareType extends IResult>(_value: CompareType): IResult<OkType, ErrType> {
		return this;
	}

	public orElse<ElseType extends IResult>(_callbackFunc: (value: ErrType) => ElseType): IResult<OkType, ErrType> {
		return this;
	}

	public and<CompareType extends IResult>(value: CompareType): CompareType {
		return value;
	}

	public cloned(): IResult<OkType, ErrType> {
		return new OkInstance<OkType, ErrType>(this.value);
	}

	public andThen<OutType extends IResult>(value: (val: OkType) => OutType): OutType {
		return value(this.value);
	}

	public toString(): `Ok(${string})` {
		return `Ok(${String(this.value)})`;
	}

	public toJSON(): IJsonOk<OkType> {
		return {
			$class: 'Ok',
			value: this.value,
		};
	}
}
