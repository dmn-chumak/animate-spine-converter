import { SpineAttachment } from './attachment/SpineAttachment';
import { SpineClippingAttachment } from './attachment/SpineClippingAttachment';
import { SpinePointAttachment } from './attachment/SpinePointAttachment';
import { SpineRegionAttachment } from './attachment/SpineRegionAttachment';
import { SpineBone } from './SpineBone';
import { SpineAttachmentType } from './types/SpineAttachmentType';
import { SpineBlendMode } from './types/SpineBlendMode';

export class SpineSlot {
    public initialized:boolean;

    public name:string;
    public bone:SpineBone;
    public attachments:SpineAttachment[];
    public attachment:SpineAttachment;
    public blend:SpineBlendMode;
    public color:string;

    public constructor() {
        this.initialized = false;
        this.attachments = [];
    }

    //-----------------------------------

    public createAttachment(name:string, type:SpineAttachmentType):SpineAttachment {
        let attachment = this.findAttachment(name);

        if (attachment != null) {
            return attachment;
        }

        if (type === SpineAttachmentType.REGION) {
            attachment = new SpineRegionAttachment();
        } else if (type === SpineAttachmentType.CLIPPING) {
            attachment = new SpineClippingAttachment();
        } else if (type === SpineAttachmentType.POINT) {
            attachment = new SpinePointAttachment();
        }

        if (attachment != null) {
            this.attachments.push(attachment);
            attachment.name = name;
        }

        return attachment;
    }

    //-----------------------------------

    public findAttachment(name:string):SpineAttachment {
        for (const attachment of this.attachments) {
            if (attachment.name === name) {
                return attachment;
            }
        }

        return null;
    }
}
