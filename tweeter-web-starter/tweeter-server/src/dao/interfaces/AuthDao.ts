import { AuthTokenDto } from "tweeter-shared";


export interface AuthDao {
  storeAuthToken(alias: string, token: AuthTokenDto): Promise<void>;
  getAuthToken(token: string): Promise<{ alias: string; expiresAt: number; dto: AuthTokenDto }| null>;
  revokeAuthToken(token: string): Promise<void>;
  // updateTokenExpiration(alias: string, token: AuthTokenDto): Promise<void>;
  createToken(alias: string): Promise<AuthTokenDto>;
}