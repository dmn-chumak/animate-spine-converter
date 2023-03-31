import { SpineClippingAttachment } from '../spine/attachment/SpineClippingAttachment';
import { SpineAnimationHelper } from '../spine/SpineAnimationHelper';
import { SpineBone } from '../spine/SpineBone';
import { SpineSlot } from '../spine/SpineSlot';
import { SpineTransformMatrix } from '../spine/transform/SpineTransformMatrix';
import { SpineBlendMode } from '../spine/types/SpineBlendMode';
import { ConvertUtil } from '../utils/ConvertUtil';
import { NumberUtil } from '../utils/NumberUtil';
import { ConverterContextGlobal } from './ConverterContextGlobal';
import { ConverterFrameLabel } from './ConverterFrameLabel';

export class ConverterContext {
    public global:ConverterContextGlobal;
    public parent:ConverterContext;

    public alpha:number;
    public blendMode:SpineBlendMode;
    public layer:FlashLayer;
    public element:FlashElement;
    public frame:FlashFrame;

    public bone:SpineBone;
    public clipping:SpineClippingAttachment;
    public slot:SpineSlot;
    public time:number;

    public constructor() {
        // empty
    }

    //-----------------------------------

    public switchContextFrame(frame:FlashFrame):ConverterContext {
        this.frame = frame;

        return this;
    }

    public switchContextAnimation(label:ConverterFrameLabel):ConverterContext {
        const { skeleton, labels } = this.global;

        if (labels.indexOf(label) !== -1) {
            this.global.animation = skeleton.createAnimation(label.name);
            this.global.label = label;
        }

        return this;
    }

    public switchContextLayer(layer:FlashLayer):ConverterContext {
        this.layer = layer;

        if (this.global.layersCache.get(layer) == null) {
            this.global.layersCache.set(layer, []);
        }

        return this;
    }

    //-----------------------------------

    public createBone(element:FlashElement, time:number):ConverterContext {
        const transform = new SpineTransformMatrix(element);
        const context = new ConverterContext();

        //-----------------------------------

        context.bone = this.global.skeleton.createBone(ConvertUtil.createBoneName(element, this), this.bone.name);
        context.clipping = this.clipping;
        context.slot = null;
        context.time = this.time + time;

        context.global = this.global;
        context.parent = this;

        context.blendMode = ConvertUtil.obtainElementBlendMode(element);
        context.alpha = this.alpha * ConvertUtil.obtainElementAlpha(element);
        context.layer = this.layer;
        context.element = element;
        context.frame = this.frame;

        if (this.blendMode !== SpineBlendMode.NORMAL && context.blendMode === SpineBlendMode.NORMAL) {
            context.blendMode = this.blendMode;
        }

        //-----------------------------------

        if (context.bone.initialized === false) {
            context.bone.initialized = true;

            SpineAnimationHelper.applyBoneTransform(
                context.bone,
                transform
            );
        }

        //-----------------------------------

        SpineAnimationHelper.applyBoneAnimation(
            context.global.animation,
            context.bone,
            context.frame,
            transform,
            context.time
        );

        //-----------------------------------

        return context;
    }

    public createSlot(element:FlashElement):ConverterContext {
        const context = new ConverterContext();

        //-----------------------------------

        context.bone = this.bone;
        context.clipping = this.clipping;
        context.slot = this.global.skeleton.createSlot(this.bone.name + '_slot', this.bone.name);
        context.time = this.time;

        context.global = this.global;
        context.parent = this;

        context.blendMode = ConvertUtil.obtainElementBlendMode(element);
        context.alpha = this.alpha;
        context.layer = this.layer;
        context.element = element;
        context.frame = this.frame;

        if (this.blendMode !== SpineBlendMode.NORMAL && context.blendMode === SpineBlendMode.NORMAL) {
            context.blendMode = this.blendMode;
        }

        //-----------------------------------

        if (context.slot.initialized === false) {
            context.slot.initialized = true;

            context.slot.color = NumberUtil.colors(0xFFFFFF, context.alpha);
            context.slot.blend = context.blendMode;

            if (context.layer != null) {
                const layerSlots = context.global.layersCache.get(context.layer);
                layerSlots.push(context.slot);
            }

            if (context.time !== 0) {
                SpineAnimationHelper.applySlotAttachment(
                    context.global.animation,
                    context.slot,
                    context.frame,
                    null,
                    0
                );
            }
        }

        //-----------------------------------

        SpineAnimationHelper.applySlotAnimation(
            context.global.animation,
            context.slot,
            context.frame,
            context.alpha,
            context.time
        );

        //-----------------------------------

        return context;
    }
}
