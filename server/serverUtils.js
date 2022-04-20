export default class ServerUtils {
    static IsNull(o) {
        return o === undefined || o === null;
    }

    static IsNullOrEmpty(o) {
        if (typeof o === 'string') {
            return this.IsNull(o) || o.length === 0;
        }
        return false;
    }
}
