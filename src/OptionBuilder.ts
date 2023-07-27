import {Err} from './Err';
import {Ok} from './Ok';
import {INone, ISome, Option, OptionImplementation} from './Option';
import {Result} from './Result';
import {ConstructorWithValueOf} from './ValueOf';

export class OptionBuilder<SomeType> implements OptionImplementation<SomeType> {
	private _isSome: boolean;
	private value: SomeType | undefined;

	constructor(isSome: false);
	constructor(isSome: true, value: SomeType);
	constructor(isSome: boolean, value?: SomeType) {
		this._isSome = isSome;
		this.value = value;
	}

	public get isNone(): boolean {
		return !this._isSome;
	}

	public get isSome(): boolean {
		return this._isSome;
	}

	public expect(msgOrError: string | Error): SomeType {
		if (this._isSome) {
			return this.value as SomeType;
		}
		throw typeof msgOrError === 'string' ? new Error(msgOrError) : msgOrError;
	}

	public unwrap(err?: ((err: Error) => Error) | undefined): SomeType {
		if (this._isSome) {
			return this.value as SomeType;
		}
		const error = new Error('Option: No value was set');
		throw err !== undefined ? err(error) : error;
	}

	public unwrapOr<DefType>(def: DefType): DefType | SomeType {
		if (this._isSome) {
			return this.value as SomeType;
		}
		return def;
	}

	public unwrapOrElse<DefType>(fn: () => DefType): DefType | SomeType {
		if (this._isSome) {
			return this.value as SomeType;
		}
		return fn();
	}

	public unwrapOrValueOf(BaseConstructor: ConstructorWithValueOf<SomeType>): SomeType {
		if (this._isSome) {
			return this.value as SomeType;
		}
		return new BaseConstructor().valueOf();
	}

	public take(): Option<SomeType> {
		const result = this.cloned();
		this.toNone();
		return result;
	}

	public cloned(): Option<SomeType> {
		if (this._isSome) {
			return new OptionBuilder<SomeType>(true, this.value as SomeType) as ISome<SomeType>;
		}
		return new OptionBuilder<SomeType>(false) as INone<SomeType>;
	}

	public eq<OtherType extends Option>(other: OtherType): boolean {
		if (this._isSome !== other.isSome) {
			return false;
		}
		if (this._isSome) {
			return this.value === other.unwrap();
		}
		return true;
	}

	public or<CompareType extends Option<unknown>>(value: CompareType): Option<SomeType> | CompareType {
		if (this._isSome) {
			return this as Option<SomeType>;
		}
		return value;
	}

	public orElse<ElseResult extends Option<unknown>>(callbackFunc: (value: void) => ElseResult): Option<SomeType> | ElseResult {
		if (this._isSome) {
			return this as Option<SomeType>;
		}
		return callbackFunc();
	}

	public and<CompareType extends Option<unknown>>(value: CompareType): Option<SomeType> | CompareType {
		if (!this._isSome) {
			return this as Option<SomeType>;
		}
		return value;
	}

	public andThen<OutType extends Option>(callbackFunc: (val: SomeType) => OutType): OutType | INone<SomeType> {
		if (this._isSome) {
			return callbackFunc(this.value as SomeType);
		}
		return this as INone<SomeType>;
	}

	public replace(value: SomeType): Option<SomeType> {
		const old = this.cloned();
		this.setValue(value);
		return old;
	}

	public insert(value: SomeType): SomeType {
		return this.setValue(value);
	}

	public getOrInsert(value: SomeType): SomeType {
		if (!this._isSome) {
			return this.setValue(value);
		}
		return this.value as SomeType;
	}

	public match<Output>(solver: Map<SomeType, () => Output>, defaultValue?: Output | undefined): Output | undefined;
	public match<Output>(solver: Map<SomeType, () => Output>, defaultValue: Output): Output;
	public match<Output>(solver: Map<SomeType, () => Output>, defaultValue?: Output | undefined): Output | undefined {
		for (const [key, value] of solver.entries()) {
			if (this._isSome && this.value === key) {
				return value();
			}
		}
		return defaultValue;
	}

	public toResult<ErrType>(err: ErrType): Result<SomeType, ErrType> {
		if (this._isSome) {
			return Ok(this.value as SomeType);
		}
		return Err(err);
	}

	private toNone(): void {
		this._isSome = false;
		this.value = undefined;
	}

	/**
	 * set the value of the option and change the state to Some
	 * @param value - the value to set
	 * @returns the value that was set
	 */
	private setValue(value: SomeType): SomeType {
		this._isSome = true;
		this.value = value;
		return value;
	}
}
