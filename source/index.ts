import { Converter } from './core/Converter';
import { ConverterConfig } from './core/ConverterConfig';
import { Logger } from './logger/Logger';
import { SpineFormatV3_8_99 } from './spine/formats/SpineFormatV3_8_99';

//-----------------------------------

const config:ConverterConfig = {
    outputFormat: new SpineFormatV3_8_99(),
    imagesExportPath: './images/',
    appendSkeletonToImagesPath: true,
    mergeSkeletons: true,
    transformRootBone: false,
    exportShapes: true,
    exportTextAsShapes: true,
    shapeExportScale: 2,
    mergeShapes: true,
    exportImages: true,
    mergeImages: true
};

//-----------------------------------

const document = fl.getDocumentDOM();
const converter = new Converter(document, config);
const result = converter.convertSelection();

for (const skeleton of result) {
    Logger.trace('Exporting skeleton: ' + skeleton.name + '...');

    if (skeleton.bones.length > 0) {
        const skeletonPath = converter.resolveWorkingPath(skeleton.name + '.json');
        FLfile.write(skeletonPath, skeleton.convert(config.outputFormat));
        Logger.trace('Skeleton export completed.');
    } else {
        Logger.error('Nothing to export.');
    }
}

//-----------------------------------

Logger.flush();
