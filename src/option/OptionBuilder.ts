import {type ConstructorWithValueOf, type OptionMatchSolver, type IResult} from '../interfaces/index.js';
import {Err, Ok} from '../result/index.js';
import {type INone, type IOption, type NB, type OptionImplementation} from './Option.js';
import {type JsonOption} from './JsonOption.js';

export class OptionBuilder<IsSome extends true | false, SomeType> implements OptionImplementation<boolean, SomeType> {
	private _isSome: boolean;
	private value: IsSome extends true ? SomeType : SomeType | undefined;

	constructor(isSome: false, value?: undefined);
	constructor(isSome: true, value: SomeType);
	constructor(isSome: IsSome, value: IsSome extends true ? SomeType : SomeType | undefined) {
		this._isSome = isSome;
		this.value = value;
	}

	public get isNone(): NB<IsSome> {
		return !this._isSome as NB<IsSome>;
	}

	public get isSome(): IsSome {
		return this._isSome as IsSome;
	}

	public expect(msgOrError: string | Error): SomeType {
		if (this.thisIsSome()) {
			return this.value;
		}
		throw typeof msgOrError === 'string' ? new Error(msgOrError) : msgOrError;
	}

	public unwrap(err?: Error | ((err: Error) => Error) | undefined): SomeType {
		if (this.thisIsSome()) {
			return this.value;
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
			return this.value;
		}
		return def;
	}

	public unwrapOrElse<DefType>(fn: () => DefType): DefType | SomeType {
		if (this.thisIsSome()) {
			return this.value;
		}
		return fn();
	}

	public unwrapOrValueOf(BaseConstructor: ConstructorWithValueOf<SomeType>): SomeType {
		if (this.thisIsSome()) {
			return this.value;
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
			return new OptionBuilder<true, SomeType>(true, this.value);
		}
		return new OptionBuilder<false, SomeType>(false);
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
			return this;
		}
		return value;
	}

	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public orElse<ElseResult extends IOption>(callbackFunc: (value: void) => ElseResult): IOption<SomeType> | ElseResult {
		if (this.thisIsSome()) {
			return this;
		}
		return callbackFunc();
	}

	public and<CompareType extends IOption>(value: CompareType): IOption<SomeType> | CompareType {
		if (this.thisIsNone()) {
			return this;
		}
		return value;
	}

	public andThen<OutType extends IOption>(callbackFunc: (val: SomeType) => OutType): OutType | INone<SomeType> {
		if (this.thisIsSome()) {
			return callbackFunc(this.value);
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
		return this.value;
	}

	public match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue?: Output | undefined): Output | undefined;
	public match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue: Output): Output;
	public match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue?: Output | undefined): Output | undefined {
		for (const [key, value] of solver.entries()) {
			if (this._isSome && this.value === key) {
				return value();
			}
		}
		return defaultValue;
	}

	public toResult<ErrType>(err: ErrType): IResult<SomeType, ErrType> {
		if (this.thisIsSome()) {
			return Ok(this.value);
		}
		return Err(err);
	}

	public toString(): `Some(${string})` | `None()` {
		if (this.thisIsSome()) {
			return `${this.getName()}(${String(this.value)})` as `Some(${string})`;
		}
		return `${this.getName()}()`;
	}

	public toJSON(): JsonOption<SomeType> {
		if (this.thisIsSome()) {
			return {
				$class: 'Some',
				value: this.value,
			};
		} else {
			return {
				$class: 'None',
				value: undefined,
			};
		}
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

	private thisIsSome(): this is OptionBuilder<true, SomeType> {
		return this._isSome;
	}

	private thisIsNone(): this is OptionBuilder<false, SomeType> {
		return !this._isSome;
	}

	private getName() {
		return this.thisIsSome() ? 'Some' : 'None';
	}
}
