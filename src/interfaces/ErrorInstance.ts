export type ErrorInstanceOf<ErrorType> = {
	instanceOf: new (...args: unknown[]) => ErrorType;
};

export type ErrorTypeGuard<ErrorType> = {
	is: (err: unknown) => err is ErrorType;
};

export type ErrorInstanceOptions<ErrorType> = ErrorInstanceOf<ErrorType> | ErrorTypeGuard<ErrorType>;
