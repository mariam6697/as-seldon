import { compare, hash } from 'bcrypt';

export default class CryptUtils {
  public static async hash(text: string): Promise<string> {
    return await hash(text, 15);
  }

  public static async validateHash(plainText: string, hashedText: string): Promise<boolean> {
    return await compare(plainText, hashedText);
  }
}
