import {ConstructorWithValueOf} from './ValueOf';
import {Result} from './Result';

/**
 * AbstractResult class for Result implementation
 */
export abstract class AbstractResult<ReturnType, ErrorType = unknown> implements Result<ReturnType, ErrorType> {
	private readonly value: ReturnType | undefined;
	private readonly error: ErrorType | undefined;
	private readonly isNotError: boolean;

	/**
	 * AbstractResult constructor
	 * @param isNotError determines if the result is an error or not
	 * @param value actual value or error in the result
	 */
	constructor(isNotError: true, value: ReturnType);

	constructor(isNotError: false, value: ErrorType);
	constructor(isNotError: boolean, value: ErrorType | ReturnType) {
		this.isNotError = isNotError;
		if (isNotError === true) {
			this.value = value as ReturnType;
		} else {
			this.error = value as ErrorType;
		}
	}

	public ok(): ReturnType | undefined {
		return this.isNotError === true ? this.value : undefined;
	}

	public isOk(): boolean {
		return this.isNotError === true;
	}

	public err(): ErrorType | undefined {
		return this.isNotError === false ? (this.error as ErrorType) : undefined;
	}

	public isErr(): boolean {
		return this.isNotError === false;
	}

	public unwrap(err?: (err: ErrorType) => Error): ReturnType {
		if (this.isNotError === true) {
			return this.value as ReturnType;
		}
		if (this.error !== undefined) {
			if (err !== undefined) {
				throw err(this.error);
			}
			throw this.error;
		}
		// istanbul ignore next
		throw new TypeError('Result: No error was set');
	}

	public unwrapOr<T extends ReturnType = ReturnType>(defaultValue: T): Exclude<ReturnType, undefined> | T {
		if (this.isNotError === false) {
			return defaultValue;
		}
		return this.value as T;
	}

	public unwrapOrElse(fn: () => ReturnType): ReturnType {
		if (this.isNotError === true) {
			return this.value as ReturnType;
		}
		return fn();
	}

	public unwrapOrValueOf(BaseConstructor: ConstructorWithValueOf<ReturnType>): ReturnType {
		if (this.isNotError === true) {
			return this.value as ReturnType;
		}
		return new BaseConstructor().valueOf();
	}

	public match<Output>(solver: {Ok: (value: ReturnType) => Output; Err: (err: ErrorType) => Output}): Output {
		if (this.isNotError === true) {
			return solver.Ok(this.value as ReturnType);
		} else {
			return solver.Err(this.error as ErrorType);
		}
	}
}
