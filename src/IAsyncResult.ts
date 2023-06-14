import {ISyncResult} from './ISyncResult';

type AsAsyncMethods<T> = {
	[Key in keyof T]: T[Key] extends (...args: infer Args) => infer Return ? (...args: Args) => Promise<Return> : T[Key];
};

export type IAsyncResult<ReturnType, ErrorType = unknown> = AsAsyncMethods<ISyncResult<ReturnType, ErrorType>>;
