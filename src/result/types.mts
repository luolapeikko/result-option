import {type IErr} from './ErrInstance.mjs';
import {type IOk} from './OkInstance.mjs';

/**
 * Infer the type of the error value from IErr
 * @since v2.0.0
 */
export type InferErrValue<T> = T extends IErr<infer E> ? E : never;

/**
 * Infer the type of the ok value from IOk
 * @since v2.0.0
 */
export type InferOkValue<T> = T extends IOk<infer V> ? V : never;
