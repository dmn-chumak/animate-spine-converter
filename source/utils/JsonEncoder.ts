export class JsonEncoder {
    public static stringifyArray(object:any, depth:number = 25):string {
        let result = '';

        for (let index = 0; index < object.length; index++) {
            if (result.length > 0) result += ',';
            result += JsonEncoder.stringify(object[index], depth);
        }

        return '[' + result + ']';
    }

    public static stringifyObject(object:any, depth:number = 25):string {
        let result = '';

        for (const key in object) {
            if (result.length > 0) result += ',';
            result += '"' + key + '":' + JsonEncoder.stringify(object[key], depth);
        }

        return '{' + result + '}';
    }

    public static stringify(object:any, depth:number = 25):string {
        if (object == null || typeof (object) === 'function') {
            return 'null';
        }

        if (typeof (object) === 'object' && depth > 0) {
            if (object.constructor !== Array) {
                return JsonEncoder.stringifyObject(object, depth - 1);
            } else {
                return JsonEncoder.stringifyArray(object, depth - 1);
            }
        }

        if (typeof (object) === 'string') {
            return '"' + object.replace('"', '\\"') + '"';
        }

        if (typeof (object) === 'number') {
            return object.toString();
        }

        return 'null';
    }
}
