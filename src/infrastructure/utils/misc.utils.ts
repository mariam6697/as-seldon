export default class MiscUtils {
  public static checkRequired(object: any, fields: string[]): boolean {
    for (let index: number = 0; index < fields.length; index++) {
      if (!object[fields[index]]) {
        return false;
      }
    }
    return true;
  }
}
