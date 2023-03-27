import { SpineAttachment } from '../attachment/SpineAttachment';
import { SpineClippingAttachment } from '../attachment/SpineClippingAttachment';
import { SpinePointAttachment } from '../attachment/SpinePointAttachment';
import { SpineRegionAttachment } from '../attachment/SpineRegionAttachment';
import { SpineAnimation } from '../SpineAnimation';
import { SpineBone } from '../SpineBone';
import { SpineEvent } from '../SpineEvent';
import { SpineSkeleton } from '../SpineSkeleton';
import { SpineSlot } from '../SpineSlot';
import { SpineTimeline } from '../timeline/SpineTimeline';
import { SpineTimelineFrame } from '../timeline/SpineTimelineFrame';
import { SpineTimelineGroup } from '../timeline/SpineTimelineGroup';

export interface SpineFormat {
    readonly version:string;

    convertSkeleton(skeleton:SpineSkeleton):any;

    convertBone(bone:SpineBone):any;

    convertBones(skeleton:SpineSkeleton):any;

    convertTimelineFrame(frame:SpineTimelineFrame):any;

    convertTimeline(timeline:SpineTimeline):any;

    convertTimelineGroup(group:SpineTimelineGroup):any;

    convertBonesTimeline(animation:SpineAnimation):any;

    convertSlotsTimeline(animation:SpineAnimation):any;

    convertAnimation(animation:SpineAnimation):any;

    convertAnimations(skeleton:SpineSkeleton):any;

    convertClippingAttachment(attachment:SpineClippingAttachment):any;

    convertPointAttachment(attachment:SpinePointAttachment):any;

    convertRegionAttachment(attachment:SpineRegionAttachment):any;

    convertAttachment(attachment:SpineAttachment):any;

    convertSlotAttachments(slot:SpineSlot):any;

    convertSlot(slot:SpineSlot):any;

    convertSlots(skeleton:SpineSkeleton):any;

    convertEvent(event:SpineEvent):any;

    convertEvents(skeleton:SpineSkeleton):any;

    convertSkinAttachments(skeleton:SpineSkeleton):any;

    convertSkins(skeleton:SpineSkeleton):any;

    convert(skeleton:SpineSkeleton):any;
}
