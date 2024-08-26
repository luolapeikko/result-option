export interface IExpect<SomeType> {
	/**
	 * expect unwraps an option and if not a Some value throws an error with the given message.
	 * @param msgOrError message or error to throw
	 * @example
	 * Some(2).expect('the world is ending') // 2
	 * None<number>().expect('the world is ending') // throws Error('the world is ending')
	 */
	expect(msgOrError: string | Error): SomeType;
}
