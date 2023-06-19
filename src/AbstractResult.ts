import {IResult} from './IResult';

/**
 * AbstractResult class for Result implementation
 */
export abstract class AbstractResult<ReturnType, ErrorType = unknown> implements IResult<ReturnType, ErrorType> {
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

	public unwrap(): ReturnType {
		if (this.isNotError === true) {
			return this.value as ReturnType;
		}
		if (this.error !== undefined) {
			throw this.error;
		}
		// istanbul ignore next
		throw new TypeError('Result: No error was set');
	}

	public unwrapOrDefault(defaultValue: ReturnType): ReturnType {
		if (this.isNotError === false) {
			return defaultValue;
		}
		return this.value as ReturnType;
	}
}
