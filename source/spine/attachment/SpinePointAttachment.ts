import { SpineAttachmentType } from '../types/SpineAttachmentType';
import { SpineAttachment } from './SpineAttachment';

export class SpinePointAttachment extends SpineAttachment {
    public x:number;
    public y:number;
    public rotation:number;
    public color:string;

    public constructor() {
        super(SpineAttachmentType.POINT);
    }
}
