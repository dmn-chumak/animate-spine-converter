import { SpineTimelineType } from '../types/SpineTimelineType';
import { SpineTimeline } from './SpineTimeline';

export class SpineTimelineGroup {
    public readonly timelines:SpineTimeline[];

    public constructor() {
        this.timelines = [];
    }

    public createTimeline(type:SpineTimelineType):SpineTimeline {
        let timeline = this.findTimeline(type);

        if (timeline != null) {
            return timeline;
        }

        timeline = new SpineTimeline();
        timeline.type = type;
        this.timelines.push(timeline);

        return timeline;
    }

    public findTimeline(type:SpineTimelineType):SpineTimeline {
        for (const timeline of this.timelines) {
            if (timeline.type === type) {
                return timeline;
            }
        }

        return null;
    }
}
