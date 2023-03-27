export class JsonUtil {
    public static validNumber(source:any):boolean {
        return (typeof (source) === 'number') && (isNaN(source) === false);
    }

    public static validString(source:any):boolean {
        return (typeof (source) === 'string') && (source.length !== 0);
    }

    public static validBoolean(source:any):boolean {
        return (typeof (source) === 'boolean');
    }

    public static validArray(source:any):boolean {
        return (typeof (source) === 'object') && (source != null) && (source.constructor === Array);
    }

    public static nonEmptyArray(source:any):boolean {
        return (source.length !== 0);
    }

    public static validObject(source:any):boolean {
        return (typeof (source) === 'object') && (source != null);
    }

    public static nonEmptyObject(source:any):boolean {
        for (const key in source) {
            if (key != null && key !== '') {
                return true;
            }
        }

        return false;
    }
}
