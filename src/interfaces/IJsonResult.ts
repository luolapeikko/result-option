/**
 * JSON representation of Ok class
 */
export type IJsonOk<OkType> = {
	$class: 'Ok';
	value: OkType;
};

/**
 * JSON representation of Err class
 */
export type IJsonErr<ErrType> = {
	$class: 'Err';
	value: ErrType;
};

/**
 * Result as JSON payload
 */
export type IJsonResult<OkType, ErrType> = IJsonOk<OkType> | IJsonErr<ErrType>;
