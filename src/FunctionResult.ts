export class FunctionResult<T> {
	private _callbackValue: T | undefined;
	private _callbackError: unknown | undefined;

	public static from<T>(call: () => T): FunctionResult<T> {
		return new FunctionResult(call);
	}

	private constructor(call: () => T) {
		try {
			this._callbackValue = call();
		} catch (err) {
			this._callbackError = err;
		}
	}

	public ok(): T | undefined {
		return this._callbackValue;
	}

	public isOk(): boolean {
		return this._callbackValue !== undefined;
	}

	public error(): unknown | undefined {
		return this._callbackError;
	}

	public isError(): boolean {
		return this._callbackError !== undefined;
	}

	public unwrap(): T {
		if (this._callbackError !== undefined) {
			throw this._callbackError;
		}
		return this._callbackValue as T;
	}

	public unwrapOrDefault(value: T): T {
		if (this._callbackError !== undefined) {
			return value;
		}
		return this._callbackValue as T;
	}
}
