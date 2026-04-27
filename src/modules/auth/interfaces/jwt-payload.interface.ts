export interface JwtPayload {
  sub: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  tokenVersion: number;
}
