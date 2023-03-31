import { SpineCurveType } from './SpineCurveType';

export class SpineTimelineFrame {
    public time:number;
    public curve:SpineCurveType;
    public angle:number;
    public name:string;
    public color:number;
    public x:number;
    public y:number;

    public constructor() {
        this.time = 0;
    }
}
