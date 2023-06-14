import {IResult} from './IResult';

export abstract class AbstractResult<ReturnType, ErrorType = unknown> implements IResult<ReturnType, ErrorType> {
	protected value: ReturnType | undefined;
	protected error: ErrorType | undefined;
	public ok(): ReturnType | undefined {
		return this.value;
	}

	public isOk(): boolean {
		return this.value !== undefined;
	}

	public err(): ErrorType | undefined {
		return this.error as ErrorType | undefined;
	}

	public isErr(): boolean {
		return this.error !== undefined;
	}

	public unwrap(): ReturnType {
		if (this.error !== undefined) {
			throw this.error;
		}
		return this.value as ReturnType;
	}

	public unwrapOrDefault(defaultValue: ReturnType): ReturnType {
		if (this.error !== undefined) {
			return defaultValue;
		}
		return this.value as ReturnType;
	}
}
