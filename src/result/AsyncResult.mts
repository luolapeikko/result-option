import {Err, Ok} from './index.mjs';
import type {IErr} from './ErrInstance.mjs';
import type {AwaitableIResult, IAsyncResult, IResult} from '../interfaces/IResultImplementation.mjs';
import type {IOk} from './OkInstance.mjs';
import type {ConstructorWithValueOf} from '../interfaces/ValueOf.mjs';
import type {INone, ISome} from '../option/index.mjs';

export class AsyncResult<OkType, ErrType> implements PromiseLike<IResult<OkType, ErrType>>, IAsyncResult<OkType, ErrType> {
	readonly #promise: Promise<IResult<OkType, ErrType>>;
	public constructor(promise: Promise<IResult<OkType, ErrType>>) {
		this.#promise = promise;
	}

	// biome-ignore lint/suspicious/noThenProperty: this is a PromiseLike
	public then<TResult1 = IResult<OkType, ErrType>, TResult2 = never>(
		onfulfilled?: ((value: IResult<OkType, ErrType>) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null,
	): Promise<TResult1 | TResult2> {
		return this.#promise.then(onfulfilled, onrejected);
	}

	public get isOk(): Promise<boolean> {
		return this.#promise.then((value) => value.isOk);
	}
	public get isErr(): Promise<boolean> {
		return this.#promise.then((value) => value.isErr);
	}
	public async ok(): Promise<OkType | undefined> {
		return (await this.#promise).ok();
	}

	public async err(): Promise<ErrType | undefined> {
		return (await this.#promise).err();
	}

	public async isOkAnd(callback: (value: OkType) => boolean): Promise<boolean> {
		return (await this.#promise).isOkAnd(callback);
	}

	public async isErrAnd(callback: (value: ErrType) => boolean): Promise<boolean> {
		return (await this.#promise).isErrAnd(callback);
	}

	public and<NextOkType, NextErrType>(other: AwaitableIResult<NextOkType, NextErrType>): AsyncResult<NextOkType, ErrType | NextErrType> {
		return new AsyncResult<NextOkType, ErrType | NextErrType>(
			this.#promise.then(async (result): Promise<IResult<NextOkType, ErrType | NextErrType>> => {
				if (result.isErr) {
					return result as unknown as IErr<ErrType | NextErrType, never>;
				}
				const next = await other;
				return next;
			}),
		);
	}

	public andThen<NextOkType, NextErrType = never>(
		callback: (value: OkType) => AwaitableIResult<NextOkType, NextErrType>,
	): AsyncResult<NextOkType, ErrType | NextErrType> {
		return new AsyncResult<NextOkType, ErrType | NextErrType>(
			this.#promise.then(async (result): Promise<IResult<NextOkType, ErrType | NextErrType>> => {
				if (result.isErr) {
					return result as unknown as IErr<ErrType | NextErrType, never>;
				}
				const next = await callback(result.ok());
				return next;
			}),
		);
	}

	public map<OutType>(callback: (value: OkType) => OutType | Promise<OutType>): AsyncResult<OutType, ErrType> {
		return new AsyncResult<OutType, ErrType>(
			this.#promise.then(async (result): Promise<IResult<OutType, ErrType>> => {
				if (result.isErr) {
					return result as unknown as IErr<ErrType, never>;
				}
				return Ok<OutType, ErrType>(await callback(result.ok()));
			}),
		);
	}

	public mapErr<OutType>(callback: (value: ErrType) => OutType | Promise<OutType>): AsyncResult<OkType, OutType> {
		return new AsyncResult<OkType, OutType>(
			this.#promise.then(async (result): Promise<IResult<OkType, OutType>> => {
				if (result.isOk) {
					return result as unknown as IOk<OkType, never>;
				}
				return Err<OutType, OkType>(await callback(result.err()));
			}),
		);
	}

	public or<NextOkType, NextErrType>(other: AwaitableIResult<NextOkType, NextErrType>): AsyncResult<OkType | NextOkType, NextErrType> {
		return new AsyncResult<OkType | NextOkType, NextErrType>(
			this.#promise.then(async (result): Promise<IResult<OkType | NextOkType, NextErrType>> => {
				if (result.isOk) {
					return result as unknown as IOk<OkType | NextOkType, never>;
				}
				const next = await other;
				return next;
			}),
		);
	}

	public orElse<NextOkType, NextErrType>(
		orElseAsyncCallback: (value: ErrType) => AwaitableIResult<NextOkType, NextErrType>,
	): AsyncResult<OkType | NextOkType, NextErrType> {
		return new AsyncResult<OkType | NextOkType, NextErrType>(
			this.#promise.then(async (result): Promise<IResult<OkType | NextOkType, NextErrType>> => {
				if (result.isOk) {
					return result as unknown as IOk<OkType | NextOkType, never>;
				}
				const next = await orElseAsyncCallback(result.err());
				return next;
			}),
		);
	}

	public async unwrap(): Promise<OkType> {
		return (await this.#promise).unwrap();
	}

	public async unwrapOr<OutType>(defaultValue: OutType): Promise<OkType | OutType> {
		return (await this.#promise).unwrapOr(defaultValue);
	}

	public async unwrapOrElse<OutType>(orElseCallback: (value: ErrType) => OutType): Promise<OkType | OutType> {
		return (await this.#promise).unwrapOrElse(orElseCallback);
	}

	public async unwrapOrValueOf<OutType>(BaseConstructor: ConstructorWithValueOf<OutType>): Promise<OkType | OutType> {
		return (await this.#promise).unwrapOrValueOf(BaseConstructor);
	}

	public async eq(other: IResult): Promise<boolean> {
		return (await this.#promise).eq(other);
	}

	public clone(): AsyncResult<OkType, ErrType> {
		return new AsyncResult<OkType, ErrType>(this.#promise);
	}

	public inspectOk(fn: (value: OkType) => void): this {
		this.#promise.then((result) => {
			if (result.isOk) {
				fn(result.ok());
			}
		});
		return this;
	}

	public inspectErr(fn: (value: ErrType) => void): this {
		this.#promise.then((result) => {
			if (result.isErr) {
				fn(result.err());
			}
		});
		return this;
	}

	public async toString(): Promise<`Ok(${string})` | `Err(${string})`> {
		return (await this.#promise).toString();
	}

	public async toJSON(): Promise<
		| {
				$class: 'Result::Ok';
				value: OkType;
		  }
		| {
				$class: 'Result::Err';
				value: ErrType;
		  }
	> {
		return (await this.#promise).toJSON();
	}

    public toOption(): Promise<ISome<OkType> | INone<never>> {
        return this.#promise.then((result) => result.toOption());
    }

    public async *iter(): AsyncIterableIterator<ISome<OkType> | INone<never>> {
		let isDone = false;
		while (!isDone) {
			yield (await this.#promise).toOption();
			isDone = true;
		}
    }
}
