import { Logger } from '../logger/Logger';
import { SpineClippingAttachment } from '../spine/attachment/SpineClippingAttachment';
import { SpineRegionAttachment } from '../spine/attachment/SpineRegionAttachment';
import { SpineAnimationHelper } from '../spine/SpineAnimationHelper';
import { SpineSkeleton } from '../spine/SpineSkeleton';
import { SpineAttachmentType } from '../spine/types/SpineAttachmentType';
import { ConvertUtil } from '../utils/ConvertUtil';
import { ImageExportFactory } from '../utils/ImageExportFactory';
import { ImageUtil } from '../utils/ImageUtil';
import { JsonEncoder } from '../utils/JsonEncoder';
import { LayerConvertFactory } from '../utils/LayerConvertFactory';
import { LayerMaskUtil } from '../utils/LayerMaskUtil';
import { LibraryUtil } from '../utils/LibraryUtil';
import { PathUtil } from '../utils/PathUtil';
import { ShapeUtil } from '../utils/ShapeUtil';
import { StringUtil } from '../utils/StringUtil';
import { ConverterConfig } from './ConverterConfig';
import { ConverterContext } from './ConverterContext';
import { ConverterContextGlobal } from './ConverterContextGlobal';

export class Converter {
    private readonly _document:FlashDocument;
    private readonly _workingPath:string;
    private readonly _config:ConverterConfig;

    public constructor(document:FlashDocument, config:ConverterConfig) {
        this._document = document;
        this._workingPath = PathUtil.parentPath(document.pathURI);
        this._config = config;
    }

    //-----------------------------------

    private convertElementSlot(context:ConverterContext, exportTarget:FlashElement | FlashItem, imageExportFactory:ImageExportFactory):void {
        let attachmentName = context.global.shapesCache.get(exportTarget);

        if (attachmentName == null) {
            attachmentName = ConvertUtil.createAttachmentName(context.element, context);
            context.global.shapesCache.set(exportTarget, attachmentName);
        }

        //-----------------------------------

        const imagePath = this.prepareImagesExportPath(context, attachmentName);
        const { slot } = context.createSlot(context.element);
        const attachment = slot.createAttachment(attachmentName, SpineAttachmentType.REGION) as SpineRegionAttachment;

        if (context.clipping != null) {
            context.clipping.end = slot;
        }

        //-----------------------------------

        let spineImage = context.global.imagesCache.get(imagePath);

        if (spineImage == null) {
            spineImage = imageExportFactory(context, imagePath);
            context.global.imagesCache.set(imagePath, spineImage);
        }

        //-----------------------------------

        attachment.width = spineImage.width;
        attachment.height = spineImage.height;
        attachment.scaleX = 1 / spineImage.scale;
        attachment.scaleY = 1 / spineImage.scale;
        attachment.x = spineImage.x;
        attachment.y = spineImage.y;

        //-----------------------------------

        SpineAnimationHelper.applySlotAttachment(
            context.global.animation,
            slot,
            context,
            attachment,
            context.time
        );
    }

    //-----------------------------------

    private convertBitmapElementSlot(context:ConverterContext):void {
        this.convertElementSlot(
            context, context.element.libraryItem,
            (context, imagePath) => {
                return ImageUtil.exportBitmap(imagePath, context.element, this._config.exportImages);
            }
        );
    }

    private convertShapeMaskElementSlot(context:ConverterContext):void {
        let attachmentName = context.global.shapesCache.get(context.element);

        if (attachmentName == null) {
            attachmentName = ConvertUtil.createAttachmentName(context.element, context);
            context.global.shapesCache.set(context.element, attachmentName);
        }

        //-----------------------------------

        const { slot } = context.createSlot(context.element);
        const attachment = slot.createAttachment(attachmentName, SpineAttachmentType.CLIPPING) as SpineClippingAttachment;
        context.clipping = attachment;

        //-----------------------------------

        attachment.vertices = ShapeUtil.extractVertices(context.element);
        attachment.vertexCount = attachment.vertices.length / 2;
        attachment.end = context.global.skeleton.findSlot(slot.name);

        //-----------------------------------

        SpineAnimationHelper.applySlotAttachment(
            context.global.animation,
            slot,
            context,
            attachment,
            context.time
        );
    }

    private convertShapeElementSlot(context:ConverterContext):void {
        this.convertElementSlot(
            context, context.element,
            (context, imagePath) => {
                return ImageUtil.exportInstance(imagePath, context.element, this._document, this._config.shapeExportScale, this._config.exportShapes);
            }
        );
    }

    //-----------------------------------

    private composeElementMaskLayer(context:ConverterContext, convertLayer:FlashLayer):void {
        this.convertElementLayer(
            context.switchContextLayer(convertLayer), convertLayer,
            (subcontext) => {
                if (subcontext.element.elementType === 'shape') {
                    this.convertShapeMaskElementSlot(subcontext);
                    context.clipping = subcontext.clipping;
                }
            }
        );
    }

    private disposeElementMaskLayer(context:ConverterContext):void {
        context.clipping = null;
    }

    //-----------------------------------

    private convertPrimitiveElement(context:ConverterContext):void {
        this.convertElementSlot(
            context, context.element.libraryItem,
            (context, imagePath) => {
                return ImageUtil.exportLibraryItem(imagePath, context.element, this._config.shapeExportScale, this._config.exportShapes);
            }
        );
    }

    private convertCompositeElementLayer(context:ConverterContext, convertLayer:FlashLayer):void {
        this.convertElementLayer(
            context.switchContextLayer(convertLayer), convertLayer,
            (subcontext) => {
                const { elementType, instanceType } = subcontext.element;

                if (elementType === 'shape') {
                    this.convertShapeElementSlot(subcontext);
                }

                if (elementType === 'text') {
                    if (this._config.exportTextAsShapes) {
                        this.convertShapeElementSlot(subcontext);
                    }
                }

                if (elementType === 'instance') {
                    if (instanceType === 'bitmap') {
                        this.convertBitmapElementSlot(subcontext);
                    }

                    if (instanceType === 'symbol') {
                        this.convertElement(subcontext);
                    }
                }
            }
        );
    }

    private convertCompositeElement(context:ConverterContext):void {
        const timeline = context.element.libraryItem.timeline;
        const layers = timeline.layers;

        for (let layerIdx = layers.length - 1; layerIdx >= 0; layerIdx--) {
            const layer = layers[layerIdx];

            if (layer.layerType === 'normal') {
                this.convertCompositeElementLayer(context, layer);
            }

            if (layer.layerType === 'masked') {
                this.composeElementMaskLayer(context, LayerMaskUtil.extractTargetMask(layers, layerIdx));
                this.convertCompositeElementLayer(context, layer);
            }

            if (layer.layerType === 'mask') {
                this.disposeElementMaskLayer(context);
            }
        }
    }

    //-----------------------------------

    private convertElementLayer(context:ConverterContext, convertLayer:FlashLayer, layerConvertFactory:LayerConvertFactory):void {
        let { startFrameIdx, endFrameIdx } = context.global.label;
        const frames = convertLayer.frames;

        if (context.parent != null) {
            startFrameIdx = 0;
            endFrameIdx = frames.length - 1;
        }

        for (let frameIdx = startFrameIdx; frameIdx <= endFrameIdx; frameIdx++) {
            const frameTime = (frameIdx - startFrameIdx) / context.global.frameRate;
            const frame = frames[frameIdx];

            if (frame == null || frame.startFrame !== frameIdx) {
                continue;
            }

            if (frame.elements.length === 0) {
                const layerSlots = context.global.layersCache.get(context.layer);

                if (layerSlots != null) {
                    const subcontext = context.switchContextFrame(frame);

                    for (const slot of layerSlots) {
                        SpineAnimationHelper.applySlotAttachment(
                            subcontext.global.animation,
                            slot,
                            subcontext,
                            null,
                            frameTime
                        );
                    }
                }

                continue;
            }

            for (const element of frame.elements) {
                const subcontext = context.switchContextFrame(frame).createBone(element, frameTime);
                this._document.library.editItem(context.element.libraryItem.name);
                this._document.getTimeline().currentFrame = frame.startFrame;
                layerConvertFactory(subcontext);
            }
        }
    }

    private convertElement(context:ConverterContext):void {
        if (LibraryUtil.isPrimitiveLibraryItem(context.element.libraryItem, this._config)) {
            this.convertPrimitiveElement(context);
        } else {
            this.convertCompositeElement(context);
        }
    }

    //-----------------------------------

    public prepareImagesExportPath(context:ConverterContext, image:string):string {
        const imagesFolder = this.resolveWorkingPath(context.global.skeleton.imagesPath);
        const imagePath = PathUtil.joinPath(imagesFolder, image + '.png');

        if (FLfile.exists(imagesFolder) === false) {
            FLfile.createFolder(imagesFolder);
        }

        return imagePath;
    }

    public resolveWorkingPath(path:string):string {
        return PathUtil.joinPath(this._workingPath, path);
    }

    public convertSymbolInstance(element:FlashElement, context:ConverterContext):boolean {
        if (element.elementType === 'instance' && element.instanceType === 'symbol') {
            try {
                for (const label of context.global.labels) {
                    const subcontext = context.switchContextAnimation(label);
                    this.convertElement(subcontext);
                }

                return true;
            } catch (error) {
                Logger.error(JsonEncoder.stringify(error));
            }
        }

        return false;
    }

    public convertSelection():SpineSkeleton[] {
        const skeleton = (this._config.mergeSkeletons ? new SpineSkeleton() : null);
        const selection = this._document.selection;
        const output:SpineSkeleton[] = [];

        //-----------------------------------

        for (const element of selection) {
            const context = ConverterContextGlobal.initialize(element, this._config, this._document.frameRate, skeleton);
            const result = this.convertSymbolInstance(element, context);

            if (result && skeleton == null) {
                output.push(context.skeleton);
            }
        }

        //-----------------------------------

        if (skeleton != null) {
            skeleton.imagesPath = this._config.imagesExportPath;
            skeleton.name = StringUtil.simplify(PathUtil.fileBaseName(this._document.name));
            output.push(skeleton);
        }

        //-----------------------------------

        return output;
    }
}
