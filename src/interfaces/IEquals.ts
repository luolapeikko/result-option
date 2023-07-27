export interface IEquals<BaseType> {
	/**
	 * Method to compare two objects
	 * @param {EqualsType} other - object to compare
	 * @returns {boolean} - true if equal
	 * @example
	 * const x = Some(2);
	 * const y = Some(2);
	 * console.log(x.eq(y)); // true
	 */
	eq<EqualsType extends BaseType>(other: EqualsType): boolean;
}
