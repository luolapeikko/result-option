/**
 * Rust style Result for Javascript Promises
 */
export class PromiseResult<T> {
	private _call: Promise<T>;
	private constructor(call: Promise<T>) {
		this._call = call;
	}

	/**
	 * create a PromiseResult from a promise
	 * @param call the promise or function provide promise to create a PromiseResult from
	 * @returns a PromiseResult
	 */
	public static from<T>(call: Promise<T> | (() => Promise<T>)): PromiseResult<T> {
		return new PromiseResult(typeof call === 'function' ? call() : call);
	}

	/**
	 * try to get value from the promise, otherwise return undefined
	 */
	public async ok(): Promise<T | undefined> {
		try {
			return await this._call;
		} catch {
			return undefined;
		}
	}

	/**
	 * Check if the promise can be resolved
	 */
	public async isOk(): Promise<boolean> {
		try {
			await this._call;
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * try to get the error from the promise, otherwise return undefined
	 */
	public async error(): Promise<unknown | undefined> {
		try {
			await this._call;
			return undefined;
		} catch (err) {
			return err;
		}
	}

	/**
	 * Check if the promise can be rejected
	 */
	public async isError(): Promise<boolean> {
		try {
			await this._call;
			return false;
		} catch {
			return true;
		}
	}

	/**
	 * Unwrap the promise, if it is rejected, throws the error
	 */
	public unwrap(): Promise<T> {
		return this._call;
	}

	/**
	 * Unwrap the promise, if it is rejected, return the default value
	 */
	public async unwrapOrDefault(value: T): Promise<T> {
		try {
			return await this._call;
		} catch {
			return value;
		}
	}
}
