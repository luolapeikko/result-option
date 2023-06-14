import {ISyncResult} from './ISyncResult';

export class SyncResult<ReturnType, ErrorType = unknown> implements ISyncResult<ReturnType, ErrorType> {
	private _callbackValue: ReturnType | undefined;
	private _callbackError: unknown | undefined;

	public static from<T, E = unknown>(call: () => T): SyncResult<T, E> {
		return new SyncResult(call);
	}

	private constructor(call: () => ReturnType) {
		try {
			this._callbackValue = call();
		} catch (err) {
			this._callbackError = err;
		}
	}

	public ok(): ReturnType | undefined {
		return this._callbackValue;
	}

	public isOk(): boolean {
		return this._callbackValue !== undefined;
	}

	public err(): ErrorType | undefined {
		return this._callbackError as ErrorType | undefined;
	}

	public isErr(): boolean {
		return this._callbackError !== undefined;
	}

	public unwrap(): ReturnType {
		if (this._callbackError !== undefined) {
			throw this._callbackError;
		}
		return this._callbackValue as ReturnType;
	}

	public unwrapOrDefault(value: ReturnType): ReturnType {
		if (this._callbackError !== undefined) {
			return value;
		}
		return this._callbackValue as ReturnType;
	}
}
