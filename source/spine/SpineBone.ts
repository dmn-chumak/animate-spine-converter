import { SpineTransformMode } from './types/SpineTransformMode';

export class SpineBone {
    public initialized:boolean;

    public name:string;
    public parent:SpineBone;
    public length:number;
    public transform:SpineTransformMode;
    public skin:boolean;
    public x:number;
    public y:number;
    public rotation:number;
    public scaleX:number;
    public scaleY:number;
    public shearX:number;
    public shearY:number;
    public color:string;

    public constructor() {
        this.initialized = false;
    }
}
