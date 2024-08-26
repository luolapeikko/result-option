import {ErrorInstanceOptions, ErrorTypeGuard} from '../interfaces/ErrorInstance.js';

export function solveErrorInstance<ErrorType extends Error>(value: unknown, opts?: ErrorInstanceOptions<ErrorType>): ErrorType | false {
	if (opts) {
		if ('instanceOf' in opts && value instanceof opts.instanceOf) {
			return value;
		}
		if ('is' in opts && opts.is(value)) {
			return value;
		}
	}
	return false;
}

export function solveErrorByName<ErrorType extends Error>(errorName: string): ErrorTypeGuard<Error> {
	return {
		is: (err: unknown): err is ErrorType => {
			return typeof err === 'object' && err !== null && 'name' in err && err.name === errorName;
		},
	};
}
