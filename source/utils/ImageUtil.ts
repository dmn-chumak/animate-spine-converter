import { SpineImage } from '../spine/SpineImage';

export class ImageUtil {
    public static exportSelection(path:string, document:FlashDocument, scale:number, autoExport:boolean, autoClose:boolean = false):SpineImage {
        document.group();

        const space = 2;
        const [ element ] = document.selection;
        const height = Math.ceil(element.height + space);
        const width = Math.ceil(element.width + space);

        element.scaleX = scale;
        element.scaleY = scale;

        document.height = height * scale;
        document.width = width * scale;
        element.y = (height * scale) / 2;
        element.x = (width * scale) / 2;

        document.unGroup();
        document.selectNone();
        document.selectAll();

        if (autoExport) {
            document.exportPNG(path, false, true);
        }

        if (autoClose) {
            document.close(false);
        }

        return {
            width: width,
            height: height,
            scale: scale,
            x: 0,
            y: 0
        };
    }

    public static exportInstance(path:string, instance:FlashElement, document:FlashDocument, scale:number, autoExport:boolean):SpineImage {
        const exporter = fl.createDocument('timeline');

        instance.layer.visible = true;
        instance.layer.locked = false;

        document.selectNone();
        document.selection = [ instance ];
        document.clipCopy();
        exporter.clipPaste();

        const [ element ] = exporter.selection;
        ImageUtil.resetTransform(element);
        exporter.selectNone();
        exporter.selectAll();

        return ImageUtil.exportSelection(
            path, exporter,
            scale, autoExport,
            true
        );
    }

    public static exportLibraryItem(path:string, instance:FlashElement, scale:number, autoExport:boolean):SpineImage {
        const exporter = fl.createDocument('timeline');

        exporter.addItem({ x: 0, y: 0 }, instance.libraryItem);

        const [ element ] = exporter.selection;
        const x = element.x;
        const y = element.y;

        const image = ImageUtil.exportSelection(
            path, exporter,
            scale, autoExport,
            true
        );

        return {
            width: image.width,
            height: image.height,
            scale: scale,
            x: -x,
            y: y
        };
    }

    public static exportBitmap(path:string, instance:FlashElement, autoExport:boolean):SpineImage {
        if (autoExport) {
            instance.libraryItem.exportToFile(path);
        }

        return {
            width: instance.libraryItem.hPixels,
            height: instance.libraryItem.vPixels,
            x: instance.libraryItem.hPixels / 2,
            y: -instance.libraryItem.vPixels / 2,
            scale: 1
        };
    }

    public static resetTransform(element:FlashElement):void {
        element.rotation = 0;
        element.scaleX = 1;
        element.scaleY = 1;
        element.skewX = 0;
        element.skewY = 0;
        element.x = 0;
        element.y = 0;
    }
}
