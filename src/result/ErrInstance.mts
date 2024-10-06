import {type ConstructorWithValueOf, type IErr, type IJsonErr, type IResult, type ResultMatchSolver} from '../interfaces/index.mjs';
import {type INone, None} from '../option/index.mjs';
import {isJsonErr} from './JsonResult.mjs';

/**
 * Err Result instance
 * @template ErrType error type
 * @since v1.0.0
 */
export class ErrInstance<ErrType> implements IErr<ErrType> {
	private readonly error: ErrType;
	public constructor(error: ErrType | IJsonErr<ErrType>) {
		this.error = isJsonErr(error) ? error.value : error;
	}

	public get isOk(): false {
		return false;
	}

	public ok() {
		return undefined;
	}

	public get isErr(): true {
		return true;
	}

	public err() {
		return this.error;
	}

	public toOption(): INone<never> {
		return None<never>();
	}

	public unwrap(err?: Error | ((err: ErrType) => Error)): never {
		if (err) {
			if (typeof err === 'function') {
				throw err(this.error);
			}
			throw err;
		}
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw this.error;
	}

	public unwrapOr<DefaultType>(defaultValue: DefaultType) {
		return defaultValue;
	}

	public unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType) {
		return callbackFunc();
	}

	public unwrapOrValueOf<ValueType>(BaseConstructor: ConstructorWithValueOf<ValueType>) {
		return new BaseConstructor().valueOf();
	}

	public eq(other: IResult) {
		return this.error === other.err();
	}

	public or<CompareResult extends IResult>(value: CompareResult) {
		return value;
	}

	public orElse<CompareResult extends IResult>(callbackFunc: (value: ErrType) => CompareResult) {
		return callbackFunc(this.error);
	}

	public and<CompareResult extends IResult>(_value: CompareResult) {
		return this;
	}

	public clone() {
		return new ErrInstance(this.error);
	}

	public andThen<OutType>(_callbackFunc: (val: never) => IResult<OutType>) {
		return this;
	}

	public match<OkOutput, ErrOutput>(solver: ResultMatchSolver<unknown, ErrType, OkOutput, ErrOutput>) {
		return solver.Err(this.error);
	}

	public toString(): `Err(${string})` {
		return `Err(${this.getErrorInstanceName()}${this.getErrorInstanceMessage()})`;
	}

	public toJSON(): IJsonErr<ErrType> {
		return {
			$class: 'Result::Err',
			value: this.error,
		};
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
