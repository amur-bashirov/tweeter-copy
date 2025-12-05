
import { UserDto} from "tweeter-shared";

export interface UserDao {
  createUser(user: UserDto, passwordHash: string): Promise<UserDto>;
  getUserByAlias(alias: string): Promise<UserDto | null>;
  getUserByAliasWithHash(alias: string): Promise<{ userDto: UserDto | null; passwordHash?: string }>;
  batchGetUsers(aliases: string[]): Promise<UserDto[]>;
}
