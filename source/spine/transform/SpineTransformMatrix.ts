import { NumberUtil } from '../../utils/NumberUtil';
import { SpineTransform } from './SpineTransform';

export class SpineTransformMatrix implements SpineTransform {
    public static readonly Y_DIRECTION:number = -1;

    public x:number;
    public y:number;
    public rotation:number;
    public scaleX:number;
    public scaleY:number;
    public shearX:number;
    public shearY:number;

    public constructor(element:FlashElement) {
        const matrix = element.matrix;

        this.y = matrix.ty * SpineTransformMatrix.Y_DIRECTION;
        this.x = matrix.tx;

        if (element.elementType === 'shape') {
            if (element.layer.layerType !== 'mask') {
                this.y = element.y * SpineTransformMatrix.Y_DIRECTION;
                this.x = element.x;
            }
        }

        this.rotation = 0;
        this.scaleX = element.scaleX;
        this.scaleY = element.scaleY;
        this.shearX = 0;
        this.shearY = 0;

        if (NumberUtil.equals(element.skewX, element.skewY)) {
            this.rotation = -element.rotation;
        } else {
            this.shearX = -element.skewY;
            this.shearY = -element.skewX;
        }
    }
}
