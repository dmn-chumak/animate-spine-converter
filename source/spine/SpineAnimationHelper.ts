import { NumberUtil } from '../utils/NumberUtil';
import { SpineAttachment } from './attachment/SpineAttachment';
import { SpineAnimation } from './SpineAnimation';
import { SpineBone } from './SpineBone';
import { SpineSlot } from './SpineSlot';
import { SpineCurveType } from './timeline/SpineCurveType';
import { SpineTransform } from './transform/SpineTransform';
import { SpineTimelineType } from './types/SpineTimelineType';

export class SpineAnimationHelper {
    public static applyBoneAnimation(animation:SpineAnimation, bone:SpineBone, frame:FlashFrame, transform:SpineTransform, time:number):void {
        const timeline = animation.createBoneTimeline(bone);
        const curve = SpineAnimationHelper.obtainFrameCurve(frame);

        const rotateTimeline = timeline.createTimeline(SpineTimelineType.ROTATE);
        const rotateFrame = rotateTimeline.createFrame(time, curve);
        rotateFrame.angle = transform.rotation - bone.rotation;

        const translateTimeline = timeline.createTimeline(SpineTimelineType.TRANSLATE);
        const translateFrame = translateTimeline.createFrame(time, curve);
        translateFrame.x = transform.x - bone.x;
        translateFrame.y = transform.y - bone.y;

        const scaleTimeline = timeline.createTimeline(SpineTimelineType.SCALE);
        const scaleFrame = scaleTimeline.createFrame(time, curve);
        scaleFrame.x = transform.scaleX / bone.scaleX;
        scaleFrame.y = transform.scaleY / bone.scaleY;

        const shearTimeline = timeline.createTimeline(SpineTimelineType.SHEAR);
        const shearFrame = shearTimeline.createFrame(time, curve);
        shearFrame.x = transform.shearX - bone.shearX;
        shearFrame.y = transform.shearY - bone.shearY;
    }

    public static applyBoneTransform(bone:SpineBone, transform:SpineTransform):void {
        bone.x = transform.x;
        bone.y = transform.y;
        bone.rotation = transform.rotation;
        bone.scaleX = transform.scaleX;
        bone.scaleY = transform.scaleY;
        bone.shearX = transform.shearX;
        bone.shearY = transform.shearY;
    }

    public static applySlotAttachment(animation:SpineAnimation, slot:SpineSlot, frame:FlashFrame, attachment:SpineAttachment, time:number):void {
        const timeline = animation.createSlotTimeline(slot);
        const curve = SpineAnimationHelper.obtainFrameCurve(frame);

        const attachmentTimeline = timeline.createTimeline(SpineTimelineType.ATTACHMENT);
        const attachmentFrame = attachmentTimeline.createFrame(time, curve);
        attachmentFrame.name = (attachment != null) ? attachment.name : null;

        if (time === 0) {
            slot.attachment = attachment;
        }
    }

    public static applySlotAnimation(animation:SpineAnimation, slot:SpineSlot, frame:FlashFrame, alpha:number, time:number):void {
        const timeline = animation.createSlotTimeline(slot);
        const curve = SpineAnimationHelper.obtainFrameCurve(frame);

        const colorTimeline = timeline.createTimeline(SpineTimelineType.COLOR);
        const colorFrame = colorTimeline.createFrame(time, curve);
        colorFrame.color = NumberUtil.colors(0xFFFFFF, alpha);
    }

    public static obtainFrameCurve(frame:FlashFrame):SpineCurveType {
        if (frame != null) {
            const points = frame.getCustomEase();

            if (frame.tweenType === 'none') {
                return 'stepped';
            }

            if (frame.tweenEasing === 0 || points == null || points.length !== 4) {
                return null;
            }

            return {
                cx1: points[1].x,
                cy1: points[1].y,
                cx2: points[2].x,
                cy2: points[2].y
            };
        }

        return null;
    }
}
