import {ConstructorWithValueOf} from './ValueOf';
import {Option} from './Option';

export class AbstractOption<ReturnType> implements Option<ReturnType> {
	private _isSome: boolean;
	private value: ReturnType | undefined;
	constructor(isSome: false);

	constructor(isSome: true, value: ReturnType);
	constructor(isSome: boolean, value?: ReturnType) {
		this._isSome = isSome;
		this.value = value;
	}

	public isNone(): boolean {
		return !this._isSome;
	}

	public isSome(): boolean {
		return this._isSome;
	}

	public expect(msgOrError: string | Error): ReturnType {
		if (this._isSome) {
			return this.value as ReturnType;
		}
		throw typeof msgOrError === 'string' ? new Error(msgOrError) : msgOrError;
	}

	public unwrap(err?: ((err: Error) => Error) | undefined): ReturnType {
		if (this._isSome) {
			return this.value as ReturnType;
		}
		const error = new Error('Option: No value was set');
		throw err !== undefined ? err(error) : error;
	}

	public unwrapOr(def: ReturnType): ReturnType {
		if (this._isSome) {
			return this.value as ReturnType;
		}
		return def;
	}

	public unwrapOrElse(fn: () => ReturnType): ReturnType {
		if (this._isSome) {
			return this.value as ReturnType;
		}
		return fn();
	}

	public unwrapOrValueOf(BaseConstructor: ConstructorWithValueOf<ReturnType>): ReturnType {
		if (this._isSome) {
			return this.value as ReturnType;
		}
		return new BaseConstructor().valueOf();
	}

	public take(): Option<ReturnType> {
		const result = this.clone();
		this.toNone();
		return result;
	}

	public clone(): Option<ReturnType> {
		if (this._isSome) {
			return new AbstractOption<ReturnType>(true, this.value as ReturnType);
		}
		return new AbstractOption<ReturnType>(false);
	}

	public eq(other: Option<ReturnType>): boolean {
		if (this._isSome !== other.isSome()) {
			return false;
		}
		if (this._isSome) {
			return this.value === other.unwrap();
		}
		return true;
	}

	public match<Output>(solver: Map<ReturnType, () => Output>, defaultValue?: Output | undefined): Output | undefined;
	public match<Output>(solver: Map<ReturnType, () => Output>, defaultValue: Output): Output;
	public match<Output>(solver: Map<ReturnType, () => Output>, defaultValue?: Output | undefined): Output | undefined {
		for (const [key, value] of solver.entries()) {
			if (this._isSome && this.value === key) {
				return value();
			}
		}
		return defaultValue;
	}

	private toNone(): void {
		this._isSome = false;
		this.value = undefined;
	}
}
