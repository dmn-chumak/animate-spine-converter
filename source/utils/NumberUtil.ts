export class NumberUtil {
    public static equals(a:number, b:number, precision:number = 0.001):boolean {
        return Math.abs(a - b) < precision;
    }

    public static colors(rgb:number, alpha:number):number {
        return rgb * 0x100 + Math.floor(alpha * 0xFF);
    }
}
