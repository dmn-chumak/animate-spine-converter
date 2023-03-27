import { SpineAttachmentType } from '../types/SpineAttachmentType';
import { SpineAttachment } from './SpineAttachment';

export class SpineRegionAttachment extends SpineAttachment {
    public path:string;
    public x:number;
    public y:number;
    public rotation:number;
    public scaleX:number;
    public scaleY:number;
    public width:number;
    public height:number;
    public color:number;

    public constructor() {
        super(SpineAttachmentType.REGION);
    }
}
