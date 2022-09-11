export default class MiscUtils {
  public static checkRequired(object: any, fields: string[]): boolean {
    for (let field of fields) {
      if (!object[field]) {
        return false;
      }
    }
    return true;
  }
}
