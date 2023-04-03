import { JsonEncoder } from '../utils/JsonEncoder';
import { SpineFormat } from './formats/SpineFormat';
import { SpineAnimation } from './SpineAnimation';
import { SpineBone } from './SpineBone';
import { SpineEvent } from './SpineEvent';
import { SpineSlot } from './SpineSlot';

export class SpineSkeleton {
    public readonly bones:SpineBone[];
    public readonly animations:SpineAnimation[];
    public readonly events:SpineEvent[];
    public readonly slots:SpineSlot[];

    public imagesPath:string;
    public name:string;

    public constructor() {
        this.imagesPath = './images/';
        this.bones = [];
        this.animations = [];
        this.events = [];
        this.slots = [];
    }

    //-----------------------------------

    public createBone(name:string, parent:SpineBone = null):SpineBone {
        let bone = this.findBone(name);

        if (bone != null) {
            return bone;
        }

        bone = new SpineBone();
        bone.parent = parent;
        bone.name = name;
        this.bones.push(bone);

        return bone;
    }

    public createAnimation(name:string):SpineAnimation {
        let animation = this.findAnimation(name);

        if (animation != null) {
            return animation;
        }

        animation = new SpineAnimation();
        animation.name = name;
        this.animations.push(animation);

        return animation;
    }

    public createSlot(name:string, parent:SpineBone = null):SpineSlot {
        let slot = this.findSlot(name);

        if (slot != null) {
            return slot;
        }

        slot = new SpineSlot();
        slot.bone = parent;
        slot.name = name;
        this.slots.push(slot);

        return slot;
    }

    public createEvent(name:string):SpineEvent {
        let event = this.findEvent(name);

        if (event != null) {
            return event;
        }

        event = new SpineEvent();
        event.name = name;
        this.events.push(event);

        return event;
    }

    //-----------------------------------

    public findBone(name:string):SpineBone {
        for (const bone of this.bones) {
            if (bone.name === name) {
                return bone;
            }
        }

        return null;
    }

    public findAnimation(name:string):SpineAnimation {
        for (const animation of this.animations) {
            if (animation.name === name) {
                return animation;
            }
        }

        return null;
    }

    public findSlot(name:string):SpineSlot {
        for (const slot of this.slots) {
            if (slot.name === name) {
                return slot;
            }
        }

        return null;
    }

    public findEvent(name:string):SpineEvent {
        for (const event of this.events) {
            if (event.name === name) {
                return event;
            }
        }

        return null;
    }

    //-----------------------------------

    public convert(format:SpineFormat):string {
        return JsonEncoder.stringify(
            format.convert(this)
        );
    }
}
