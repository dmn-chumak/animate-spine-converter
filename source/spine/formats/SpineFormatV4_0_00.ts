import { SpineTimelineFrame } from '../timeline/SpineTimelineFrame';
import { SpineTimelineGroup } from '../timeline/SpineTimelineGroup';
import { SpineTimelineType } from '../types/SpineTimelineType';
import { SpineFormatV3_8_99 } from './SpineFormatV3_8_99';

export class SpineFormatV4_0_00 extends SpineFormatV3_8_99 {
    public override readonly version:string = '4.0.64';

    public override convertTimelineFrameCurve(frame:SpineTimelineFrame):any {
        const curve = frame.curve;

        if (curve === 'stepped') {
            return { curve: 'stepped' };
        }

        return null;
    }

    public override convertTimelineGroup(group:SpineTimelineGroup):any {
        const result:any = {};

        for (const timeline of group.timelines) {
            result[this.convertTimelineType(timeline.type)] = this.convertTimeline(timeline);
        }

        return result;
    }

    public convertTimelineType(type:string):string {
        if (type === SpineTimelineType.COLOR) {
            return 'rgba';
        }

        return type;
    }
}
