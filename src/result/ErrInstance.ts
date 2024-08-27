import {type ConstructorWithValueOf, type IErr, type IResult, type ResultMatchSolver} from '../interfaces/index.js';
import {type INone, None} from '../option/index.js';

export class ErrInstance<OkType, ErrType> implements IErr<OkType, ErrType> {
	private readonly error: ErrType;
	public readonly isOk = false;
	public readonly isErr = true;
	public constructor(error: ErrType) {
		this.error = error;
	}

	public ok(): undefined {
		return undefined;
	}

	public err(): ErrType {
		return this.error;
	}

	public toOption(): INone<OkType> {
		return None<OkType>();
	}

	public unwrap(err?: Error | ((err: ErrType) => Error) | undefined): OkType {
		if (err) {
			if (typeof err === 'function') {
				throw err(this.error);
			}
			throw err;
		}
		throw this.error as Error;
	}

	public unwrapOr<DefaultType>(defaultValue: DefaultType): DefaultType {
		return defaultValue;
	}

	public unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType): DefaultType {
		return callbackFunc();
	}

	public unwrapOrValueOf(BaseConstructor: ConstructorWithValueOf<OkType>): OkType {
		return new BaseConstructor().valueOf();
	}

	public eq<EqualsType extends IResult>(other: EqualsType): boolean {
		return this.error === other.err();
	}

	public or<CompareType extends IResult>(value: CompareType): CompareType {
		return value;
	}

	public orElse<ElseType extends IResult>(callbackFunc: (value: ErrType) => ElseType): ElseType {
		return callbackFunc(this.error);
	}

	public and<CompareType extends IResult>(_value: CompareType): IResult<OkType, ErrType> {
		return this;
	}

	public cloned(): IResult<OkType, ErrType> {
		return new ErrInstance<OkType, ErrType>(this.error);
	}

	public andThen<OutType extends IResult>(_value: (val: OkType) => OutType): IErr<OkType, ErrType> {
		return this;
	}

	public match<OkOutput, ErrOutput>(solver: ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput>): ErrOutput {
		return solver.Err(this.error);
	}

	public toString(): `Err(${string})` {
		return `Err(${this.getErrorInstanceName()}${this.getErrorInstanceMessage()})`;
	}

	private getErrorInstanceName(): string {
		if (typeof this.error === 'object' && this.error !== null) {
			return this.error.constructor.name;
		}
		return 'UnknownErrorInstance';
	}

	private getErrorInstanceMessage(): string {
		if (this.error instanceof Error) {
			return `: '${this.error.message}'`;
		}
		return `: '${JSON.stringify(this.error)}'`;
	}
}
