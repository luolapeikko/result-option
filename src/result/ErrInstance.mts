import {type ConstructorWithValueOf, type IJsonErr, type IResult, type IResultBuild, type ResultMatchSolver} from '../interfaces/index.mjs';
import {type INone, None} from '../option/index.mjs';
import {isJsonErr} from './JsonResult.mjs';

/**
 * Err Result instance
 * @template ErrType error type
 * @since v1.0.0
 */
export class ErrInstance<ErrType> implements IResultBuild<false, never, ErrType> {
	private readonly error: ErrType;
	private originalStack: string | undefined;
	public constructor(error: ErrType | IJsonErr<ErrType>) {
		this.error = isJsonErr(error) ? error.value : error;
	}

	public get isOk(): false {
		return false;
	}

	public isOkAnd(_callbackFunc: (value: never) => boolean): false {
		return false;
	}

	public isErrAnd(callbackFunc: (value: ErrType) => boolean): boolean {
		return callbackFunc(this.error);
	}

	public ok(): undefined {
		return undefined;
	}

	public get isErr(): true {
		return true;
	}

	public err(): ErrType {
		return this.error;
	}

	public toOption(): INone<never> {
		return None<never>();
	}

	public unwrap(): never {
		if (this.error instanceof Error && 'captureStackTrace' in Error) {
			// Preserve the original stack trace if available
			this.originalStack ??= (this.error.stack ?? '')
				.split('\n')
				.map((line, idx) => (idx === 0 ? line : `    ${line}`))
				.join('\n');
			Error.captureStackTrace(this.error); // Capture the current stack trace
			// Append the original stack trace to the error
			if (this.originalStack) {
				this.error.stack = this.error.stack + '\n    Caused by: ' + this.originalStack;
			}
		}
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw this.error;
	}

	public unwrapOr<DefaultType>(defaultValue: DefaultType): DefaultType {
		return defaultValue;
	}

	public unwrapOrElse<DefaultType>(callbackFunc: () => DefaultType): DefaultType {
		return callbackFunc();
	}

	public unwrapOrValueOf<ValueType>(BaseConstructor: ConstructorWithValueOf<ValueType>): ValueType {
		return new BaseConstructor().valueOf();
	}

	public eq(other: IResult): boolean {
		return this.error === other.err();
	}

	public or<CompareResult extends IResult>(value: CompareResult): CompareResult {
		return value;
	}

	public orElse<OutResult extends IResult<unknown, unknown>>(callbackFunc: (value: ErrType) => OutResult): OutResult {
		return callbackFunc(this.error);
	}

	public orElsePromise<OutResult extends IResult<unknown, unknown>>(callbackFunc: (value: ErrType) => Promise<OutResult>): Promise<OutResult> {
		return callbackFunc(this.error);
	}

	public and<CompareResult extends IResult>(_value: CompareResult): this {
		return this;
	}

	public clone(): ErrInstance<ErrType> {
		return new ErrInstance(this.error);
	}

	public andThen<OutResult extends IResult<unknown, unknown>>(_callbackFunc: (val: never) => OutResult): this {
		return this;
	}

	public andThenPromise<OutResult extends IResult<unknown, unknown>>(_callbackFunc: (val: never) => Promise<OutResult>): this {
		return this;
	}

	public match<OkOutput, ErrOutput>(solver: ResultMatchSolver<unknown, ErrType, OkOutput, ErrOutput>): ErrOutput {
		return solver.Err(this.error);
	}

	public map<NewOkType>(_callbackFunc: (val: never) => NewOkType): ErrInstance<ErrType> {
		return this;
	}

	public mapErr<NewErrType>(fn: (value: ErrType) => NewErrType): ErrInstance<NewErrType> {
		return new ErrInstance(fn(this.error));
	}

	public inspect(_fn: (value: never) => void): this {
		return this;
	}

	public inspectErr(fn: (value: ErrType) => void): this {
		fn(this.error);
		return this;
	}

	public *iter(): IterableIterator<INone> {
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
