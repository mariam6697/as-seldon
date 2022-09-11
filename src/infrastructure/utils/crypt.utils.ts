import { compare, hash } from 'bcrypt';

export default class CryptUtils {
  public static async hash(text: string): Promise<string> {
    return hash(text, 15);
  }

  public static async validateHash(plainText: string, hashedText: string): Promise<boolean> {
    return compare(plainText, hashedText);
  }
}
