import { SpineTimeline } from '../timeline/SpineTimeline';
import { SpineTimelineFrame } from '../timeline/SpineTimelineFrame';
import { SpineTimelineGroup } from '../timeline/SpineTimelineGroup';
import { SpineTimelineGroupBone } from '../timeline/SpineTimelineGroupBone';
import { SpineTimelineGroupSlot } from '../timeline/SpineTimelineGroupSlot';
import { SpineTimelineType } from '../types/SpineTimelineType';

interface FrameChecker {
    (group:SpineTimelineGroup, frame:SpineTimelineFrame):boolean;
}

export class SpineFormatOptimizer {
    protected readonly _frameCheckersMap:Record<SpineTimelineType, FrameChecker>;

    public constructor() {
        this._frameCheckersMap = {
            [SpineTimelineType.ATTACHMENT]: this.isEmptyAttachmentFrame,
            [SpineTimelineType.COLOR]: this.isEmptyColorFrame,

            [SpineTimelineType.ROTATE]: this.isEmptyRotateFrame,
            [SpineTimelineType.TRANSLATE]: this.isEmptyTranslateFrame,
            [SpineTimelineType.SCALE]: this.isEmptyScaleFrame,
            [SpineTimelineType.SHEAR]: this.isEmptyShearFrame
        };
    }

    //-----------------------------------

    protected isEmptyRotateFrame(group:SpineTimelineGroupBone, frame:SpineTimelineFrame):boolean {
        return (frame.angle === 0);
    }

    protected isEmptyTranslateFrame(group:SpineTimelineGroupBone, frame:SpineTimelineFrame):boolean {
        return (frame.x === 0 && frame.y === 0);
    }

    protected isEmptyScaleFrame(group:SpineTimelineGroupBone, frame:SpineTimelineFrame):boolean {
        return (frame.x === 1 && frame.y === 1);
    }

    protected isEmptyShearFrame(group:SpineTimelineGroupBone, frame:SpineTimelineFrame):boolean {
        return (frame.x === 0 && frame.y === 0);
    }

    protected isEmptyAttachmentFrame(group:SpineTimelineGroupSlot, frame:SpineTimelineFrame):boolean {
        if (group.slot.attachment != null) {
            return (frame.name === group.slot.attachment.name);
        }

        return (frame.name == null);
    }

    protected isEmptyColorFrame(group:SpineTimelineGroupSlot, frame:SpineTimelineFrame):boolean {
        return (group.slot.color === frame.color);
    }

    //-----------------------------------

    protected isEmptyTimeline(group:SpineTimelineGroup, timeline:SpineTimeline):boolean {
        const checker = this._frameCheckersMap[timeline.type];

        if (checker != null) {
            for (const frame of timeline.frames) {
                if (checker(group, frame) === false) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    //-----------------------------------

    public optimizeTimeline(group:SpineTimelineGroup):void {
        const timelines = group.timelines;

        for (let index = 0; index < timelines.length; index++) {
            const timeline = timelines[index];

            if (this.isEmptyTimeline(group, timeline)) {
                timelines.splice(index, 1);
                index--;
            }
        }
    }
}
