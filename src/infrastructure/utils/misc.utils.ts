import CustomError from '../models/error.model';

export default class MiscUtils {
  public static checkRequired(object: any, fields: string[]): boolean {
    for (let field of fields) {
      if (!object[field]) {
        return false;
      }
    }
    return true;
  }

  public static hasRequiredData(object: any, fields: string[]): void {
    const hasRequiredData: boolean = MiscUtils.checkRequired(object, fields);
    if (!hasRequiredData) {
      throw CustomError.REQUIRED_DATA;
    }
  }
}
