import { JsonFormatUtil } from '../../utils/JsonFormatUtil';
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
import { SpineAttachmentType } from '../types/SpineAttachmentType';
import { SpineFormat } from './SpineFormat';

export class SpineFormatV3_8_99 implements SpineFormat {
    public readonly version:string = '3.8.99';

    public constructor() {
        // empty
    }

    //-----------------------------------

    public convertSkeleton(skeleton:SpineSkeleton):any {
        return {
            spine: this.version,
            images: skeleton.imagesPath,
            hash: 'unknown'
        };
    }

    public convertBone(bone:SpineBone):any {
        return JsonFormatUtil.cleanObject({
            name: bone.name,
            parent: (bone.parent != null) ? bone.parent.name : null,
            length: bone.length,
            transform: bone.transform,
            skin: bone.skin,
            x: bone.x,
            y: bone.y,
            rotation: bone.rotation,
            scaleX: bone.scaleX,
            scaleY: bone.scaleY,
            shearX: bone.shearX,
            shearY: bone.shearY,
            color: bone.color
        });
    }

    public convertBones(skeleton:SpineSkeleton):any[] {
        const result:any[] = [];

        for (const bone of skeleton.bones) {
            result.push(this.convertBone(bone));
        }

        return result;
    }

    //-----------------------------------

    public convertTimelineFrame(frame:SpineTimelineFrame):any {
        return JsonFormatUtil.cleanObject({
            time: frame.time,
            curve: frame.curve,
            angle: frame.angle,
            name: frame.name,
            color: frame.color,
            x: frame.x,
            y: frame.y
        });
    }

    public convertTimeline(timeline:SpineTimeline):any[] {
        const length = timeline.frames.length;
        const result:any[] = [];

        for (let index = 0; index < length; index++) {
            const frame = this.convertTimelineFrame(timeline.frames[index]);

            if (index === (length - 1)) {
                // last frame cannot contain curve property
                delete frame.curve;
            }

            result.push(frame);
        }

        return result;
    }

    public convertTimelineGroup(group:SpineTimelineGroup):any {
        const result:any = {};

        for (const timeline of group.timelines) {
            result[timeline.type] = this.convertTimeline(timeline);
        }

        return result;
    }

    public convertBonesTimeline(animation:SpineAnimation):any {
        const result:any = {};

        for (const group of animation.bones) {
            result[group.bone.name] = this.convertTimelineGroup(group);
        }

        return result;
    }

    public convertSlotsTimeline(animation:SpineAnimation):any {
        const result:any = {};

        for (const group of animation.slots) {
            result[group.slot.name] = this.convertTimelineGroup(group);
        }

        return result;
    }

    public convertAnimation(animation:SpineAnimation):any {
        return JsonFormatUtil.cleanObject({
            bones: this.convertBonesTimeline(animation),
            events: this.convertTimeline(animation.events),
            slots: this.convertSlotsTimeline(animation)
        });
    }

    public convertAnimations(skeleton:SpineSkeleton):any {
        const result:any = {};

        for (const animation of skeleton.animations) {
            result[animation.name] = this.convertAnimation(animation);
        }

        return result;
    }

    //-----------------------------------

    public convertClippingAttachment(attachment:SpineClippingAttachment):any {
        return JsonFormatUtil.cleanObject({
            type: attachment.type,
            name: attachment.name,
            end: (attachment.end != null) ? attachment.end.name : null,
            vertexCount: attachment.vertexCount,
            vertices: attachment.vertices,
            color: attachment.color
        });
    }

    public convertPointAttachment(attachment:SpinePointAttachment):any {
        return JsonFormatUtil.cleanObject({
            type: attachment.type,
            name: attachment.name,
            x: attachment.x,
            y: attachment.y,
            rotation: attachment.rotation,
            color: attachment.color
        });
    }

    public convertRegionAttachment(attachment:SpineRegionAttachment):any {
        return JsonFormatUtil.cleanObject({
            type: attachment.type,
            name: attachment.name,
            path: attachment.path,
            x: attachment.x,
            y: attachment.y,
            rotation: attachment.rotation,
            scaleX: attachment.scaleX,
            scaleY: attachment.scaleY,
            width: attachment.width,
            height: attachment.height,
            color: attachment.color
        });
    }

    public convertAttachment(attachment:SpineAttachment):any {
        switch (attachment.type) {
            case SpineAttachmentType.CLIPPING:
                return this.convertClippingAttachment(attachment as SpineClippingAttachment);
            case SpineAttachmentType.POINT:
                return this.convertPointAttachment(attachment as SpinePointAttachment);
            case SpineAttachmentType.REGION:
                return this.convertRegionAttachment(attachment as SpineRegionAttachment);
        }

        return null;
    }

    public convertSlotAttachments(slot:SpineSlot):any {
        const result:any = {};

        for (const attachment of slot.attachments) {
            result[attachment.name] = this.convertAttachment(attachment);
        }

        return result;
    }

    public convertSlot(slot:SpineSlot):any {
        return JsonFormatUtil.cleanObject({
            name: slot.name,
            bone: (slot.bone != null) ? slot.bone.name : null,
            attachment: (slot.attachment != null) ? slot.attachment.name : null,
            blend: slot.blend,
            color: slot.color
        });
    }

    public convertSlots(skeleton:SpineSkeleton):any[] {
        const result:any[] = [];

        for (const slot of skeleton.slots) {
            result.push(this.convertSlot(slot));
        }

        return result;
    }

    //-----------------------------------

    public convertEvent(event:SpineEvent):any {
        return JsonFormatUtil.cleanObject({
            name: event.name,
            int: event.int,
            float: event.float,
            string: event.string
        });
    }

    public convertEvents(skeleton:SpineSkeleton):any {
        const result:any = {};

        for (const event of skeleton.events) {
            result[event.name] = this.convertEvent(event);
        }

        return result;
    }

    //-----------------------------------

    public convertSkinAttachments(skeleton:SpineSkeleton):any {
        const result:any = {};

        for (const slot of skeleton.slots) {
            result[slot.name] = this.convertSlotAttachments(slot);
        }

        return result;
    }

    public convertSkins(skeleton:SpineSkeleton):any[] {
        return [
            {
                attachments: this.convertSkinAttachments(skeleton),
                name: 'default'
            }
        ];
    }

    //-----------------------------------

    public convert(skeleton:SpineSkeleton):any {
        return JsonFormatUtil.cleanObject({
            skeleton: this.convertSkeleton(skeleton),
            bones: this.convertBones(skeleton),
            animations: this.convertAnimations(skeleton),
            slots: this.convertSlots(skeleton),
            events: this.convertEvents(skeleton),
            skins: this.convertSkins(skeleton)
        });
    }
}
