import { SpineBone } from './SpineBone';
import { SpineSlot } from './SpineSlot';
import { SpineTimeline } from './timeline/SpineTimeline';
import { SpineTimelineGroupBone } from './timeline/SpineTimelineGroupBone';
import { SpineTimelineGroupSlot } from './timeline/SpineTimelineGroupSlot';

export class SpineAnimation {
    public readonly bones:SpineTimelineGroupBone[];
    public readonly events:SpineTimeline;
    public readonly slots:SpineTimelineGroupSlot[];

    public name:string;

    public constructor() {
        this.bones = [];
        this.events = new SpineTimeline();
        this.slots = [];
    }

    //-----------------------------------

    public createBoneTimeline(bone:SpineBone):SpineTimelineGroupBone {
        let timeline = this.findBoneTimeline(bone);

        if (timeline != null) {
            return timeline;
        }

        timeline = new SpineTimelineGroupBone();
        timeline.bone = bone;
        this.bones.push(timeline);

        return timeline;
    }

    public createEvent(name:string, time:number):void {
        this.events.createFrame(time, null, false).name = name;
    }

    public createSlotTimeline(slot:SpineSlot):SpineTimelineGroupSlot {
        let timeline = this.findSlotTimeline(slot);

        if (timeline != null) {
            return timeline;
        }

        timeline = new SpineTimelineGroupSlot();
        timeline.slot = slot;
        this.slots.push(timeline);

        return timeline;
    }

    //-----------------------------------

    public findBoneTimeline(bone:SpineBone):SpineTimelineGroupBone {
        for (const timeline of this.bones) {
            if (timeline.bone === bone) {
                return timeline;
            }
        }

        return null;
    }

    public findSlotTimeline(slot:SpineSlot):SpineTimelineGroupSlot {
        for (const timeline of this.slots) {
            if (timeline.slot === slot) {
                return timeline;
            }
        }

        return null;
    }
}
