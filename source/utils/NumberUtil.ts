export class NumberUtil {
    public static equals(first:number, second:number, precision:number = 0.001):boolean {
        return Math.abs(first - second) < precision;
    }

    public static clamp(value:number):number {
        return (value < 1) ? ((value > 0) ? value : 0) : 1;
    }

    public static prepend(content:string, value:number, length:number):string {
        while (content.length < length) {
            content = value + content;
        }

        return content;
    }

    public static color(value:number):string {
        const color = Math.floor(value * 255).toString(16);
        return NumberUtil.prepend(color, 0, 2);
    }
}
