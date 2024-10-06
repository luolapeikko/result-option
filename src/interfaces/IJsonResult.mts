/**
 * JSON representation of Ok class
 * @since v0.6.6
 */
export type IJsonOk<OkType> = {
	$class: 'Result::Ok';
	value: OkType;
};

/**
 * JSON representation of Err class
 * @since v0.6.6
 */
export type IJsonErr<ErrType> = {
	$class: 'Result::Err';
	value: ErrType;
};

/**
 * Result as JSON payload
 * @since v0.6.6
 */
export type IJsonResult<OkType, ErrType> = IJsonOk<OkType> | IJsonErr<ErrType>;
