export class User {
  id: number;
  username: string;
  password: string;
  avatar: string;
  email: string;
  gender: string;
  lastVisit: number;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
}
