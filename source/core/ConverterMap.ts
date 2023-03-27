export class ConverterMap<KeyType, ValueType> {
    public readonly values:ValueType[];
    public readonly keys:KeyType[];

    public constructor() {
        this.values = [];
        this.keys = [];
    }

    public set(key:KeyType, value:ValueType):void {
        this.values.push(value);
        this.keys.push(key);
    }

    public get(key:KeyType):ValueType {
        for (let index = 0; index < this.keys.length; index++) {
            if (this.keys[index] === key) {
                return this.values[index];
            }
        }

        return null;
    }
}
