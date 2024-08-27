import {type ConstructorWithValueOf, type IResult} from '../interfaces/index.js';
import {Err, Ok} from '../result/index.js';
import {type INone, type IOption, type ISome, type OptionImplementation} from './Option.js';

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
		if (this.thisIsSome()) {
			return this.value as SomeType;
		}
		throw typeof msgOrError === 'string' ? new Error(msgOrError) : msgOrError;
	}

	public unwrap(err?: Error | ((err: Error) => Error) | undefined): SomeType {
		if (this.thisIsSome()) {
			return this.value as SomeType;
		}
		const error = new Error(`${this.getName()}: No value was set`);
		if (err) {
			if (typeof err === 'function') {
				throw err(error);
			}
			throw err;
		}
		throw error;
	}

	public unwrapOr<DefType>(def: DefType): DefType | SomeType {
		if (this.thisIsSome()) {
			return this.value as SomeType;
		}
		return def;
	}

	public unwrapOrElse<DefType>(fn: () => DefType): DefType | SomeType {
		if (this.thisIsSome()) {
			return this.value as SomeType;
		}
		return fn();
	}

	public unwrapOrValueOf(BaseConstructor: ConstructorWithValueOf<SomeType>): SomeType {
		if (this.thisIsSome()) {
			return this.value as SomeType;
		}
		return new BaseConstructor().valueOf();
	}

	public take(): IOption<SomeType> {
		const result = this.cloned();
		this.removeValue();
		return result;
	}

	public cloned(): IOption<SomeType> {
		if (this.thisIsSome()) {
			return new OptionBuilder<SomeType>(true, this.value as SomeType) as ISome<SomeType>;
		}
		return new OptionBuilder<SomeType>(false) as INone<SomeType>;
	}

	public eq<OtherType extends IOption>(other: OtherType): boolean {
		if (this._isSome !== other.isSome) {
			return false;
		}
		if (this._isSome) {
			return this.value === other.unwrap();
		}
		return true;
	}

	public or<CompareType extends IOption>(value: CompareType): IOption<SomeType> | CompareType {
		if (this.thisIsSome()) {
			return this as IOption<SomeType>;
		}
		return value;
	}

	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public orElse<ElseResult extends IOption>(callbackFunc: (value: void) => ElseResult): IOption<SomeType> | ElseResult {
		if (this.thisIsSome()) {
			return this as IOption<SomeType>;
		}
		return callbackFunc();
	}

	public and<CompareType extends IOption>(value: CompareType): IOption<SomeType> | CompareType {
		if (this.thisIsNone()) {
			return this as IOption<SomeType>;
		}
		return value;
	}

	public andThen<OutType extends IOption>(callbackFunc: (val: SomeType) => OutType): OutType | INone<SomeType> {
		if (this.thisIsSome()) {
			return callbackFunc(this.value as SomeType);
		}
		return this as INone<SomeType>;
	}

	public replace(value: SomeType): IOption<SomeType> {
		const old = this.cloned();
		this.setValue(value);
		return old;
	}

	public insert(value: SomeType): SomeType {
		return this.setValue(value);
	}

	public getOrInsert(value: SomeType): SomeType {
		if (!this.thisIsSome()) {
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

	public toResult<ErrType>(err: ErrType): IResult<SomeType, ErrType> {
		if (this.thisIsSome()) {
			return Ok(this.value as SomeType);
		}
		return Err(err);
	}

	public toString(): `Some(${string})` | `None()` {
		if (this.thisIsSome()) {
			return `${this.getName()}(${String(this.value)})` as `Some(${string})`;
		}
		return `${this.getName()}()`;
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

	private removeValue(): SomeType | undefined {
		const value = this.value;
		this._isSome = false;
		this.value = undefined as SomeType; // change the type to undefined
		return value;
	}

	private thisIsSome(): this is ISome<SomeType> {
		return this._isSome;
	}

	private thisIsNone(): this is INone<SomeType> {
		return !this._isSome;
	}

	private getName() {
		return this.thisIsSome() ? 'Some' : 'None';
	}
}
