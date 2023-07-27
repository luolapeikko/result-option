export interface IClone<CloneType> {
	/**
	 * Method to clone an object
	 * @returns {CloneType} - cloned object instance
	 * @example
	 * const x = Some(2);
	 * const y = x.clone();
	 */
	cloned(): CloneType;
}
