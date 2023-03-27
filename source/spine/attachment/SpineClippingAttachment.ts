import { SpineSlot } from '../SpineSlot';
import { SpineAttachmentType } from '../types/SpineAttachmentType';
import { SpineAttachment } from './SpineAttachment';

export class SpineClippingAttachment extends SpineAttachment {
    public end:SpineSlot;
    public vertexCount:number;
    public vertices:number[];
    public color:number;

    public constructor() {
        super(SpineAttachmentType.CLIPPING);

        this.vertexCount = 0;
        this.vertices = [];
    }
}
