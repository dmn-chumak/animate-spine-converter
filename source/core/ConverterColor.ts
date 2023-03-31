import { NumberUtil } from '../utils/NumberUtil';

export class ConverterColor {
    private _parent:ConverterColor;
    private _element:FlashElement;

    public constructor(element:FlashElement = null) {
        this._parent = null;
        this._element = element;
    }

    public blend(element:FlashElement):ConverterColor {
        const color = new ConverterColor(element);
        color._parent = this;
        return color;
    }

    public merge():string {
        let current:ConverterColor = this;

        let visible = 1;
        let alpha = 1;
        let red = 1;
        let green = 1;
        let blue = 1;

        //-----------------------------------

        while (current != null && current._element != null) {
            const element = current._element;

            if (element.visible === false) {
                visible = 0;
            }

            alpha = visible * NumberUtil.clamp(alpha * (element.colorAlphaPercent / 100) + element.colorAlphaAmount / 255);
            red = NumberUtil.clamp(red * (element.colorRedPercent / 100) + element.colorRedAmount / 255);
            green = NumberUtil.clamp(green * (element.colorGreenPercent / 100) + element.colorGreenAmount / 255);
            blue = NumberUtil.clamp(blue * (element.colorBluePercent / 100) + element.colorBlueAmount / 255);

            current = current._parent;
        }

        //-----------------------------------

        return (
            NumberUtil.color(red) +
            NumberUtil.color(green) +
            NumberUtil.color(blue) +
            NumberUtil.color(alpha)
        );
    }
}
