import {type IErrBuilder} from '../interfaces/IResultImplementation.mjs';
import {type IOkBuilder} from '../interfaces/IResultImplementation.mjs';
import {type IResult} from '../interfaces/IResultImplementation.mjs';

/**
 * Infer the type of the error value from IErr
 * @since v2.0.0
 */
export type InferErrValue<T> = T extends IErrBuilder<infer E, any> ? E : never;

/**
 * Infer the type of the ok value from IOk
 * @since v2.0.0
 */
export type InferOkValue<T> = T extends IOkBuilder<infer V, any> ? V : never;

/**
 * Unwrap IResult type to get the Ok value type (similar to Awaited for Promise)
 * Handles both IOk instances and IResult union types by extracting the Ok type
 * @since v2.2.0
 */
export type UnwrapResult<T> = T extends IOkBuilder<infer V, any> ? V : T extends IErrBuilder<any, any> ? never : T;

/**
 * Preserve function overloads when wrapping with Result for sync functions
 * @since v2.2.0
 */
export type WrapFnReturn<Fn, ErrType> = Fn extends {
	(...args: infer A1): infer R1;
	(...args: infer A2): infer R2;
	(...args: infer A3): infer R3;
	(...args: infer A4): infer R4;
	(...args: infer A5): infer R5;
}
	? {
			(...args: A1): IResult<UnwrapResult<R1>, ErrType>;
			(...args: A2): IResult<UnwrapResult<R2>, ErrType>;
			(...args: A3): IResult<UnwrapResult<R3>, ErrType>;
			(...args: A4): IResult<UnwrapResult<R4>, ErrType>;
			(...args: A5): IResult<UnwrapResult<R5>, ErrType>;
	  }
	: Fn extends {
			(...args: infer A1): infer R1;
			(...args: infer A2): infer R2;
			(...args: infer A3): infer R3;
			(...args: infer A4): infer R4;
	  }
	  ? {
				(...args: A1): IResult<UnwrapResult<R1>, ErrType>;
				(...args: A2): IResult<UnwrapResult<R2>, ErrType>;
				(...args: A3): IResult<UnwrapResult<R3>, ErrType>;
				(...args: A4): IResult<UnwrapResult<R4>, ErrType>;
		  }
	  : Fn extends {
				(...args: infer A1): infer R1;
				(...args: infer A2): infer R2;
				(...args: infer A3): infer R3;
		  }
		  ? {
					(...args: A1): IResult<UnwrapResult<R1>, ErrType>;
					(...args: A2): IResult<UnwrapResult<R2>, ErrType>;
					(...args: A3): IResult<UnwrapResult<R3>, ErrType>;
			  }
		  : Fn extends {
					(...args: infer A1): infer R1;
					(...args: infer A2): infer R2;
			  }
			  ? {
						(...args: A1): IResult<UnwrapResult<R1>, ErrType>;
						(...args: A2): IResult<UnwrapResult<R2>, ErrType>;
				  }
			  : Fn extends (...args: infer A) => infer R
				  ? (...args: A) => IResult<UnwrapResult<R>, ErrType>
				  : never;

/**
 * Preserve function overloads when wrapping with Result for async functions
 * @since v2.1.0
 */
export type WrapAsyncFnReturn<Fn, ErrType> = Fn extends {
	(...args: infer A1): infer R1;
	(...args: infer A2): infer R2;
	(...args: infer A3): infer R3;
	(...args: infer A4): infer R4;
	(...args: infer A5): infer R5;
}
	? {
			(...args: A1): Promise<IResult<UnwrapResult<Awaited<R1>>, ErrType>>;
			(...args: A2): Promise<IResult<UnwrapResult<Awaited<R2>>, ErrType>>;
			(...args: A3): Promise<IResult<UnwrapResult<Awaited<R3>>, ErrType>>;
			(...args: A4): Promise<IResult<UnwrapResult<Awaited<R4>>, ErrType>>;
			(...args: A5): Promise<IResult<UnwrapResult<Awaited<R5>>, ErrType>>;
	  }
	: Fn extends {
			(...args: infer A1): infer R1;
			(...args: infer A2): infer R2;
			(...args: infer A3): infer R3;
			(...args: infer A4): infer R4;
	  }
	  ? {
				(...args: A1): Promise<IResult<UnwrapResult<Awaited<R1>>, ErrType>>;
				(...args: A2): Promise<IResult<UnwrapResult<Awaited<R2>>, ErrType>>;
				(...args: A3): Promise<IResult<UnwrapResult<Awaited<R3>>, ErrType>>;
				(...args: A4): Promise<IResult<UnwrapResult<Awaited<R4>>, ErrType>>;
		  }
	  : Fn extends {
				(...args: infer A1): infer R1;
				(...args: infer A2): infer R2;
				(...args: infer A3): infer R3;
		  }
		  ? {
					(...args: A1): Promise<IResult<UnwrapResult<Awaited<R1>>, ErrType>>;
					(...args: A2): Promise<IResult<UnwrapResult<Awaited<R2>>, ErrType>>;
					(...args: A3): Promise<IResult<UnwrapResult<Awaited<R3>>, ErrType>>;
			  }
		  : Fn extends {
					(...args: infer A1): infer R1;
					(...args: infer A2): infer R2;
			  }
			  ? {
						(...args: A1): Promise<IResult<UnwrapResult<Awaited<R1>>, ErrType>>;
						(...args: A2): Promise<IResult<UnwrapResult<Awaited<R2>>, ErrType>>;
				  }
			  : Fn extends (...args: infer A) => infer R
				  ? (...args: A) => Promise<IResult<UnwrapResult<Awaited<R>>, ErrType>>
				  : never;
