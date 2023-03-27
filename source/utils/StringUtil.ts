export class StringUtil {
    public static simplify(value:string):string {
        const lastSlash = value.lastIndexOf('/');
        const regex = /[\/\-. ]+/gi;

        if (lastSlash !== -1) {
            value = value.slice(lastSlash + 1);
        }

        return (
            value.replace(regex, '_')
                .toLowerCase()
        );
    }
}
