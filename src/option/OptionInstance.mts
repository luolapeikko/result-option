import {type ConstructorWithValueOf, type IJsonNone, type IJsonSome, type OptionMatchSolver} from '../interfaces/index.mjs';
import {asMapped, type IOptionImplementation, type MappedType} from '../interfaces/IOptionImplementation.mjs';
import {Err, type IErr, type IOk, Ok} from '../result/index.mjs';
import {buildJsonNone, buildJsonSome} from './JsonOption.mjs';

/**
 * OptionBuilder is a class that represents an optional value: every Option is either Some and contains a value and type, or None which does not any type.
 * @since v1.0.0
 */
export class OptionBuilder<IsSome extends boolean, SomeType = unknown> implements IOptionImplementation<IsSome, SomeType> {
	private _isSome: IsSome;
	private value: SomeType;

	public constructor(isSome: IsSome, value: SomeType) {
		this._isSome = isSome;
		this.value = value;
	}

	public get isSome(): MappedType<IsSome, true, false> {
		return asMapped(this._isSome, true, false);
	}

	public get isNone(): MappedType<IsSome, false, true> {
		return asMapped(this._isSome, false, true);
	}

	public cloned(): OptionBuilder<IsSome, SomeType> {
		return new OptionBuilder(this._isSome, this.value);
	}

	public insert(value: SomeType): SomeType {
		return this.setValue(value);
	}

	public take(): OptionBuilder<IsSome, SomeType | undefined> {
		return new OptionBuilder(this._isSome, this.removeValue());
	}

	public replace(value: SomeType): OptionBuilder<IsSome, SomeType> {
		const clone = this.cloned();
		this.setValue(value);
		return clone;
	}

	public unwrap(err?: Error | ((err: Error) => Error)): MappedType<IsSome, SomeType, never> {
		if (!this._isSome) {
			const error = new Error(`None: No value was set`);
			if (err) {
				throw typeof err === 'function' ? err(error) : err;
			}
			throw error;
		}
		return {true: this.value, false: undefined as never}[`${this._isSome}`];
	}

	public unwrapOr<DefType>(def: DefType): MappedType<IsSome, SomeType, DefType> {
		return {true: this.value, false: def}[`${this._isSome}`];
	}

	public unwrapOrElse<DefType>(fn: () => DefType): MappedType<IsSome, SomeType, DefType> {
		return {true: this.value, false: fn()}[`${this._isSome}`];
	}

	public unwrapOrValueOf<DefType>(BaseConstructor: ConstructorWithValueOf<DefType>): MappedType<IsSome, SomeType, DefType> {
		return asMapped<IsSome, SomeType, DefType>(this._isSome, this.value, new BaseConstructor().valueOf());
	}

	public eq(other: IOption): boolean {
		if (this.isNone && other.isNone) {
			return true;
		}
		if (this.isSome && other.isSome) {
			return this.value === other.unwrap();
		}
		return false; // mismatched Some and None
	}

	public or<ValueType>(value: IOption<ValueType>): MappedType<IsSome, this, IOption<ValueType>> {
		return asMapped<IsSome, this, IOption<ValueType>>(this._isSome, this, value);
	}

	public orElse<ValueType>(callbackFunc: (value: SomeType) => IOption<ValueType>): MappedType<IsSome, this, IOption<ValueType>> {
		return asMapped<IsSome, this, IOption<ValueType>>(this._isSome, this, callbackFunc(this.value));
	}

	public and<CompareType>(value: IOption<CompareType>): MappedType<IsSome, IOption<CompareType>, this> {
		return asMapped<IsSome, IOption<CompareType>, this>(this._isSome, value, this);
	}

	public andThen<CompareType, OverrideType = unknown>(
		callbackFunc: (value: MappedType<IsSome, SomeType, OverrideType>) => IOption<CompareType>,
	): MappedType<IsSome, IOption<CompareType>, this> {
		const mappedValue = asMapped<IsSome, SomeType, OverrideType>(this._isSome, this.value, this.value as unknown as OverrideType);
		return asMapped<IsSome, IOption<CompareType>, this>(this._isSome, callbackFunc(mappedValue), this);
	}

	public getOrInsert(value: SomeType): SomeType {
		return this._isSome ? this.value : this.setValue(value);
	}

	public match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue?: Output): Output | undefined;
	public match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue: Output): Output;
	public match<Output>(solver: OptionMatchSolver<SomeType, Output>, defaultValue?: Output): Output | undefined {
		for (const [key, value] of solver.entries()) {
			if (this._isSome && this.value === key) {
				return value();
			}
		}
		return defaultValue;
	}

	public map<NewType>(fn: (value: SomeType) => NewType): MappedType<IsSome, ISome<NewType>, INone<NewType>> {
		const isSome = this._isSome;
		const value = this._isSome ? fn(this.removeValue() as SomeType) : undefined;
		return asMapped<IsSome, ISome<NewType>, INone<NewType>>(isSome, new OptionBuilder(true, value as NewType), new OptionBuilder(false, undefined as never));
	}

	public expect(error: string | Error): MappedType<IsSome, SomeType, never> {
		if (!this._isSome) {
			throw error instanceof Error ? error : new Error(error);
		}
		return asMapped<IsSome, SomeType, never>(this._isSome, this.value, undefined as never);
	}

	public toResult<ErrType>(err: ErrType): MappedType<IsSome, IOk<SomeType>, IErr<ErrType>> {
		return asMapped<IsSome, IOk<SomeType>, IErr<ErrType>>(this._isSome, Ok(this.value), Err(err));
	}

	public toJSON(): MappedType<IsSome, IJsonSome<SomeType>, IJsonNone> {
		return asMapped<IsSome, IJsonSome<SomeType>, IJsonNone>(this._isSome, buildJsonSome(this.value), buildJsonNone());
	}

	public toOptionString(): MappedType<IsSome, `Some(${string})`, 'None()'> {
		return asMapped<IsSome, `Some(${string})`, 'None()'>(this._isSome, `Some(${String(this.value)})`, 'None()');
	}

	public toString(): string {
		if (!this._isSome) {
			return 'None';
		}
		return String(this.value);
	}

	/**
	 * Change the value to None
	 */
	private removeValue(): SomeType | undefined {
		const value = this.value;
		this._isSome = false as IsSome;
		this.value = undefined as never;
		return value;
	}

	private setValue<DefType>(value: DefType): DefType {
		this._isSome = true as IsSome;
		this.value = value as unknown as SomeType;
		return value;
	}
}

export type ISome<SomeType> = OptionBuilder<true, SomeType>;
export type INone<SomeType = unknown> = OptionBuilder<false, SomeType>;

/**
 * IOption represents an optional value: every Option is either Some and contains a value and type, or None which does not any type.
 * @template SomeType type of the value
 * @example
 * function divide(numerator: number, denominator: number): Option<number> {
 *   if (denominator === 0) {
 *     return None<number>();
 *   }
 *   return Some(numerator / denominator);
 * }
 * const result = divide(2, 3);
 * if (result.isSome) {
 *   console.log('Result: ' + result.unwrap());
 * } else {
 *   console.log('Cannot divide by 0');
 * }
 */
export type IOption<SomeType = unknown> = OptionBuilder<true, SomeType> | OptionBuilder<false, SomeType>;

export function isOption<SomeType>(value: unknown): value is IOption<SomeType> {
	return value instanceof OptionBuilder;
}

export function isSome<SomeType>(value: unknown): value is ISome<SomeType> {
	return value instanceof OptionBuilder && value.isSome === true;
}

export function isNone<SomeType = unknown>(value: unknown): value is INone<SomeType> {
	return value instanceof OptionBuilder && value.isNone === true;
}
