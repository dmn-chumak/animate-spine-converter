import { SpineTimelineType } from '../types/SpineTimelineType';
import { SpineCurveType } from './SpineCurveType';
import { SpineTimelineFrame } from './SpineTimelineFrame';

export class SpineTimeline {
    public readonly frames:SpineTimelineFrame[];

    public type:SpineTimelineType;

    public constructor() {
        this.frames = [];
    }

    public createFrame(time:number, curve:SpineCurveType, unique:boolean = true):SpineTimelineFrame {
        let frame = this.findFrame(time);

        if (frame != null && unique) {
            return frame;
        }

        frame = new SpineTimelineFrame();
        frame.curve = curve;
        frame.time = time;
        this.frames.push(frame);

        return frame;
    }

    public findFrame(time:number):SpineTimelineFrame {
        for (const frame of this.frames) {
            if (frame.time === time) {
                return frame;
            }
        }

        return null;
    }
}
