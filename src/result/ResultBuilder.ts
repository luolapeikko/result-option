import {type ConstructorWithValueOf, type ResultMatchSolver} from '../interfaces/index.js';
import type {IErr, IResult, IResultImplementation} from './Result.js';
import {type IOption, None, Some} from '../option/index.js';

/**
 * ResultBuilder class for Result implementation
 */
export class ResultBuilder<OkType, ErrType> implements IResultImplementation<OkType, ErrType> {
	private readonly value: OkType | undefined;
	private readonly error: ErrType | undefined;
	private readonly isNotError: boolean;

	/**
	 * ResultBuilder constructor
	 * @param isNotError determines if the result is an error or not
	 * @param value actual value or error in the result
	 */
	constructor(isNotError: true, value: OkType);
	constructor(isNotError: false, value: ErrType);
	constructor(isNotError: boolean, value: ErrType | OkType) {
		this.isNotError = isNotError;
		if (isNotError) {
			this.value = value as OkType;
		} else {
			this.error = value as ErrType;
		}
	}

	public ok(): OkType | undefined {
		return this.isNotError ? this.value : undefined;
	}

	public get isOk(): boolean {
		return this.isNotError;
	}

	public err(): ErrType | undefined {
		return !this.isNotError ? (this.error as ErrType) : undefined;
	}

	public get isErr(): boolean {
		return !this.isNotError;
	}

	public unwrap(err?: Error | ((err: ErrType) => Error)): OkType {
		if (this.isNotError) {
			return this.value as OkType;
		}
		if (this.error !== undefined) {
			if (err !== undefined) {
				if (typeof err === 'function') {
					throw err(this.error);
				} else {
					throw err;
				}
			}
			throw this.error as Error;
		}
		// istanbul ignore next
		throw new TypeError('Result: No error was set');
	}

	public unwrapOr<DefType>(defaultValue: DefType): DefType | OkType {
		if (this.isNotError) {
			return this.value as OkType;
		}
		return defaultValue;
	}

	public unwrapOrElse<DefType>(fn: () => DefType): DefType | OkType {
		if (this.isNotError) {
			return this.value as OkType;
		}
		return fn();
	}

	public unwrapOrValueOf(BaseConstructor: ConstructorWithValueOf<OkType>): OkType {
		if (this.isNotError) {
			return this.value as OkType;
		}
		return new BaseConstructor().valueOf();
	}

	public match<OkOutput, ErrOutput>(solver: ResultMatchSolver<OkType, ErrType, OkOutput, ErrOutput>): OkOutput | ErrOutput {
		if (this.isNotError) {
			return solver.Ok(this.value as OkType);
		} else {
			return solver.Err(this.error as ErrType);
		}
	}

	public eq<OtherType extends IResult>(other: OtherType): boolean {
		if (this.isNotError) {
			return other.isOk && this.value === other.ok();
		}
		return other.isErr && this.error === other.err();
	}

	public and<CompareType extends IResult>(value: CompareType): IResult<OkType, ErrType> | CompareType {
		if (!this.isNotError) {
			return this as IResult<OkType, ErrType>;
		}
		return value;
	}

	public andThen<OutType extends IResult>(value: (val: OkType) => OutType): IErr<OkType, ErrType> | OutType {
		if (!this.isNotError) {
			return this as IErr<OkType, ErrType>;
		}
		return value(this.value as OkType);
	}

	public or<CompareType extends IResult>(value: CompareType): IResult<OkType, ErrType> | CompareType {
		if (this.isNotError) {
			return this as IResult<OkType, ErrType>;
		}
		return value;
	}

	public orElse<ElseResult extends IResult>(callbackFunc: (value: ErrType) => ElseResult): IResult<OkType, ErrType> | ElseResult {
		if (this.isNotError) {
			return this as IResult<OkType, ErrType>;
		}
		return callbackFunc(this.error as ErrType);
	}

	public cloned(): IResult<OkType, ErrType> {
		if (this.isNotError) {
			return new ResultBuilder<OkType, ErrType>(true, this.value as OkType) as IResult<OkType, ErrType>;
		}
		return new ResultBuilder<OkType, ErrType>(false, this.error as ErrType) as IResult<OkType, ErrType>;
	}

	public toOption(): IOption<OkType> {
		if (this.isNotError) {
			return Some(this.value as OkType);
		}
		return None<OkType>();
	}

	public toString(): `Ok(${string})` | `Err(${string})` {
		if (this.isNotError) {
			return `Ok(${String(this.value)})`;
		}
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

/**
 * Type guard for Result interface
 * @template OkType Type of the return value, default is unknown
 * @template ErrType Type of the error, default is unknown
 * @param {unknown} value unknown value
 * @returns {boolean} true if value is Result
 */
export function isResult<OkType = unknown, ErrType = unknown>(value: unknown): value is IResult<OkType, ErrType> {
	return value instanceof ResultBuilder;
}
