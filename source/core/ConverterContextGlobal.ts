import { SpineAnimation } from '../spine/SpineAnimation';
import { SpineAnimationHelper } from '../spine/SpineAnimationHelper';
import { SpineImage } from '../spine/SpineImage';
import { SpineSkeleton } from '../spine/SpineSkeleton';
import { SpineSlot } from '../spine/SpineSlot';
import { SpineTransformMatrix } from '../spine/transform/SpineTransformMatrix';
import { SpineBlendMode } from '../spine/types/SpineBlendMode';
import { ConvertUtil } from '../utils/ConvertUtil';
import { PathUtil } from '../utils/PathUtil';
import { StringUtil } from '../utils/StringUtil';
import { ConverterColor } from './ConverterColor';
import { ConverterConfig } from './ConverterConfig';
import { ConverterContext } from './ConverterContext';
import { ConverterFrameLabel } from './ConverterFrameLabel';
import { ConverterMap } from './ConverterMap';

export class ConverterContextGlobal extends ConverterContext {
    public imagesCache:ConverterMap<string, SpineImage>;
    public shapesCache:ConverterMap<FlashElement | FlashItem, string>;
    public layersCache:ConverterMap<FlashLayer, SpineSlot[]>;

    public labels:ConverterFrameLabel[];
    public animation:SpineAnimation;
    public label:ConverterFrameLabel;
    public skeleton:SpineSkeleton;
    public frameRate:number;

    public static initializeGlobal(element:FlashElement, config:ConverterConfig, frameRate:number, skeleton:SpineSkeleton = null, cache:ConverterContextGlobal = null):ConverterContextGlobal {
        const transform = new SpineTransformMatrix(element);
        const name = StringUtil.simplify(element.libraryItem.name);
        const context = (cache == null) ? ConverterContextGlobal.initializeCache() : cache;

        //-----------------------------------

        context.global = context;
        context.parent = null;

        context.labels = ConvertUtil.obtainElementLabels(element);
        context.animation = null;
        context.frameRate = frameRate;
        context.label = null;

        //-----------------------------------

        context.skeleton = (skeleton == null) ? new SpineSkeleton() : skeleton;
        context.skeleton.imagesPath = (config.appendSkeletonToImagesPath ? PathUtil.joinPath(config.imagesExportPath, name) : config.imagesExportPath);
        context.skeleton.name = name;

        context.bone = context.skeleton.createBone('root');
        context.clipping = null;
        context.slot = null;

        context.blendMode = SpineBlendMode.NORMAL;
        context.color = new ConverterColor();
        context.layer = null;
        context.element = element;
        context.frame = null;
        context.time = 0;

        //-----------------------------------

        if (config.mergeSkeletons && config.mergeSkeletonsRootBone !== true) {
            context.bone = context.skeleton.createBone(
                context.skeleton.name,
                context.bone.name
            );
        }

        //-----------------------------------

        if (config.transformRootBone) {
            SpineAnimationHelper.applyBoneTransform(
                context.bone,
                transform
            );
        }

        //-----------------------------------

        return context;
    }

    public static initializeCache():ConverterContextGlobal {
        const context = new ConverterContextGlobal();

        //-----------------------------------

        context.imagesCache = new ConverterMap<string, SpineImage>();
        context.shapesCache = new ConverterMap<FlashElement | FlashItem, string>();
        context.layersCache = new ConverterMap<FlashLayer, SpineSlot[]>();

        //-----------------------------------

        return context;
    }

    public constructor() {
        super();
    }
}
