export class PathUtil {
    public static parentPath(path:string):string {
        const index = path.lastIndexOf('/');

        if (index !== -1) {
            return path.slice(0, index);
        }

        return '';
    }

    public static removeTrailingSlash(path:string):string {
        while (path.length > 0 && path[path.length - 1] === '/') {
            path = path.slice(0, path.length - 1);
        }

        return path;
    }

    public static removeLeadingSlash(path:string):string {
        while (path.length > 0 && path[0] === '/') {
            path = path.slice(1);
        }

        return path;
    }

    public static joinPath(...paths:string[]):string {
        let result = '';

        for (const path of paths) {
            if (result.length > 0) {
                result = PathUtil.removeTrailingSlash(result) + '/' + PathUtil.removeLeadingSlash(path);
            } else {
                result = path;
            }
        }

        return result;
    }
}
