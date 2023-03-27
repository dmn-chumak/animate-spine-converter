import { NumberUtil } from '../utils/NumberUtil';
import { SpineAttachment } from './attachment/SpineAttachment';
import { SpineAnimation } from './SpineAnimation';
import { SpineBone } from './SpineBone';
import { SpineSlot } from './SpineSlot';
import { SpineTransform } from './transform/SpineTransform';
import { SpineTimelineType } from './types/SpineTimelineType';

export class SpineAnimationHelper {
    public static applyBoneAnimation(animation:SpineAnimation, bone:SpineBone, transform:SpineTransform, time:number):void {
        const timeline = animation.createBoneTimeline(bone);

        const rotateTimeline = timeline.createTimeline(SpineTimelineType.ROTATE);
        const rotateFrame = rotateTimeline.createFrame(time);
        rotateFrame.angle = transform.rotation - bone.rotation;

        const translateTimeline = timeline.createTimeline(SpineTimelineType.TRANSLATE);
        const translateFrame = translateTimeline.createFrame(time);
        translateFrame.x = transform.x - bone.x;
        translateFrame.y = transform.y - bone.y;

        const scaleTimeline = timeline.createTimeline(SpineTimelineType.SCALE);
        const scaleFrame = scaleTimeline.createFrame(time);
        scaleFrame.x = transform.scaleX / bone.scaleX;
        scaleFrame.y = transform.scaleY / bone.scaleY;

        const shearTimeline = timeline.createTimeline(SpineTimelineType.SHEAR);
        const shearFrame = shearTimeline.createFrame(time);
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

    public static applySlotAttachment(animation:SpineAnimation, slot:SpineSlot, attachment:SpineAttachment, time:number):void {
        const timeline = animation.createSlotTimeline(slot);

        const attachmentTimeline = timeline.createTimeline(SpineTimelineType.ATTACHMENT);
        const attachmentFrame = attachmentTimeline.createFrame(time);
        attachmentFrame.name = (attachment != null) ? attachment.name : null;

        if (time === 0) {
            slot.attachment = attachment;
        }
    }

    public static applySlotAnimation(animation:SpineAnimation, slot:SpineSlot, alpha:number, time:number):void {
        const timeline = animation.createSlotTimeline(slot);

        const colorTimeline = timeline.createTimeline(SpineTimelineType.COLOR);
        const colorFrame = colorTimeline.createFrame(time);
        colorFrame.color = NumberUtil.colors(0xFFFFFF, alpha);
    }
}
