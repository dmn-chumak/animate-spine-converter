import { ConverterConfig } from '../core/ConverterConfig';

export class LibraryUtil {
    public static isPrimitiveLibraryItem(libraryItem:FlashItem, config:ConverterConfig):boolean {
        let bitmapsCount = 0;
        let shapesCount = 0;

        /**
         * Detecting, if the provided library item (MovieClip or Graphics) is simple enough
         * to be exported as a single image, and to reduce amount of slots.
         *
         * Requirements:
         * - only normal layers;
         * - only one frame on each layer;
         * - only bitmaps or shapes.
         */

        if (libraryItem.itemType !== 'movie clip' && libraryItem.itemType !== 'graphic') {
            return false;
        }

        for (const layer of libraryItem.timeline.layers) {
            const [ frame ] = layer.frames;

            if (layer.frames.length !== 1 || layer.layerType !== 'normal') {
                return false;
            }

            for (const element of frame.elements) {
                if (element.elementType === 'instance') {
                    if (element.instanceType === 'bitmap') {
                        bitmapsCount++;
                    } else {
                        return false;
                    }
                } else if (element.elementType === 'shape') {
                    shapesCount++;
                } else if (element.elementType === 'text') {
                    if (config.exportTextAsShapes) {
                        shapesCount++;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }

        if (bitmapsCount > 0 && shapesCount > 0) {
            return (config.mergeImages && config.mergeShapes);
        }

        if (bitmapsCount === 0 && shapesCount !== 0) {
            return config.mergeShapes;
        }

        if (bitmapsCount !== 0 && shapesCount === 0) {
            return config.mergeImages;
        }

        return true;
    }
}
