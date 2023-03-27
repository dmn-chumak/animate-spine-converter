import { SpineAttachmentType } from '../types/SpineAttachmentType';

export class SpineAttachment {
    public type:SpineAttachmentType;
    public name:string;

    public constructor(type:SpineAttachmentType) {
        this.type = type;
    }
}
