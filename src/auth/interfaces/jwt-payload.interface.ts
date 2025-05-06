export interface IJwtPayload {
  id: string;
  role: 'USER' | 'ADMIN';
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export type JwtPayloadWithRt = IJwtPayload & { refreshToken: string };
