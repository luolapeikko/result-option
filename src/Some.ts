import {OptionBuilder} from './OptionBuilder';
import {ISome} from './Option';

export function Some<SomeType = unknown>(value: SomeType): ISome<SomeType> {
	return new OptionBuilder<SomeType>(true, value) as ISome<SomeType>;
}
