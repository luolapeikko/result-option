import {IAsyncResult} from './IAsyncResult';
import {ISyncResult} from './ISyncResult';

export type IResult<ReturnType, ErrorType = unknown> = ISyncResult<ReturnType, ErrorType> | IAsyncResult<ReturnType, ErrorType>;
