import { ConverterContext } from '../core/ConverterContext';
import { SpineImage } from '../spine/SpineImage';

export interface ImageExportFactory {
    (context:ConverterContext, imagePath:string):SpineImage;
}
