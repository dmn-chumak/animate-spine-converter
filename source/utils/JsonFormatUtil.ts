import { JsonUtil } from './JsonUtil';

export class JsonFormatUtil {
    public static cleanObject(source:any):any {
        const result:any = {};

        /**
         * Removing undefined, incorrect or non-essential properties
         * to reduce output JSON file size.
         */

        for (const key in source) {
            const value = source[key];

            if (JsonUtil.validNumber(value)) {
                if (key === 'color') {
                    result[key] = (value as number).toString(16);
                    continue;
                }

                if (key === 'shearX' || key === 'shearY' || key === 'rotation') {
                    if (value !== 0) {
                        result[key] = value;
                    }

                    continue;
                }

                if (key === 'scaleX' || key === 'scaleY') {
                    if (value !== 1) {
                        result[key] = value;
                    }

                    continue;
                }

                result[key] = value;
            }

            if (JsonUtil.validArray(value)) {
                if (JsonUtil.nonEmptyArray(value)) {
                    result[key] = value;
                }

                continue;
            }

            if (JsonUtil.validObject(value)) {
                if (JsonUtil.nonEmptyObject(value)) {
                    result[key] = value;
                }

                continue;
            }

            if (JsonUtil.validBoolean(value)) {
                result[key] = value;
            }

            if (JsonUtil.validString(value)) {
                result[key] = value;
            }
        }

        return result;
    }
}
