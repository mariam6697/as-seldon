import jwt from 'jsonwebtoken';
import User from '../../auth/models/user.model';

export default class JwtUtils {
  public static async getAccessToken(user: User): Promise<any> {
    const accessToken: string = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        type: 'access'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    const decoded: any = jwt.verify(accessToken, process.env.JWT_SECRET);
    return { id: user._id, accessToken, expiration: decoded.exp };
  }
}
