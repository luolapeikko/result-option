/* eslint-disable @typescript-eslint/no-explicit-any */
import {SyncResult} from './SyncResult';

/**
 * build safe wrapper for callback function
 * @template TArgs function arguments
 * @template ReturnType return type
 * @template ErrorType error type
 * @param func callback function
 * @returns FunctionResult
 */
export function safeResult<TArgs extends any[], ReturnType, ErrorType = unknown>(func: (...args: TArgs) => ReturnType) {
	return (...args: TArgs): SyncResult<ReturnType, ErrorType> => {
		return SyncResult.from<ReturnType, ErrorType>(() => func(...args));
	};
}
