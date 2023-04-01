import { SpineFormat } from '../spine/formats/SpineFormat';

export interface ConverterConfig {
    outputFormat:SpineFormat;
    imagesExportPath?:string;
    appendSkeletonToImagesPath?:boolean;
    mergeSkeletons?:boolean;
    transformRootBone?:boolean;
    exportShapes?:boolean;
    exportTextAsShapes?:boolean;
    shapeExportScale?:number;
    mergeShapes?:boolean;
    exportImages?:boolean;
    mergeImages?:boolean;
}
