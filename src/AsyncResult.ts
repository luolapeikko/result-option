import {IAsyncResult} from './IAsyncResult';

/**
 * Rust style Result for Javascript Promises
 */
export class AsyncResult<ReturnType, ErrorType = unknown> implements IAsyncResult<ReturnType, ErrorType> {
	private _call: Promise<ReturnType>;
	private constructor(call: Promise<ReturnType>) {
		this._call = call;
	}

	/**
	 * create a PromiseResult from a promise
	 * @param call the promise or function provide promise to create a PromiseResult from
	 * @returns a PromiseResult
	 */
	public static from<ReturnType, ErrorType = unknown>(call: Promise<ReturnType> | (() => Promise<ReturnType>)): AsyncResult<ReturnType, ErrorType> {
		return new AsyncResult(typeof call === 'function' ? call() : call);
	}

	public async ok(): Promise<ReturnType | undefined> {
		try {
			return await this._call;
		} catch {
			return undefined;
		}
	}

	public async isOk(): Promise<boolean> {
		try {
			await this._call;
			return true;
		} catch {
			return false;
		}
	}

	public async err(): Promise<ErrorType | undefined> {
		try {
			await this._call;
			return undefined;
		} catch (err) {
			return err as ErrorType;
		}
	}

	public async isErr(): Promise<boolean> {
		try {
			await this._call;
			return false;
		} catch {
			return true;
		}
	}

	public unwrap(): Promise<ReturnType> {
		return this._call;
	}

	public async unwrapOrDefault(value: ReturnType): Promise<ReturnType> {
		try {
			return await this._call;
		} catch {
			return value;
		}
	}
}
