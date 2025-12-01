
import { UserDto, AuthTokenDto } from "tweeter-shared";

export interface UserDao {
  createUser(user: UserDto, passwordHash: string): Promise<UserDto>;
  getUserByAlias(alias: string): Promise<UserDto | null>;
  getUserByAliasWithHash(alias: string): Promise<{ user: UserDto | null; passwordHash?: string }>;
  storeAuthToken(alias: string, token: AuthTokenDto, expiresAt: number): Promise<void>;
  getAuthToken(token: string): Promise<AuthTokenDto | null>;
  revokeAuthToken(token: string): Promise<void>;
}
