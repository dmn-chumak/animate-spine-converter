import { ConverterContext } from '../core/ConverterContext';

export interface LayerConvertFactory {
    (context:ConverterContext):void;
}
