
import { UserDao } from "../interfaces/UserDao";
import { UserDto, AuthTokenDto } from "tweeter-shared";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoUserDao implements UserDao {

  private client: DynamoDBDocumentClient;
  private readonly tableName = "TweeterUsers";
  private readonly authTokenTable = "TweeterAuthTokens";

  constructor() {
    const baseClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(baseClient);
  }
  getUserByAlias(alias: string): Promise<UserDto | null> {
    throw new Error("Method not implemented.");
  }
  getUserByAliasWithHash(alias: string): Promise<{ user: UserDto | null; passwordHash?: string; }> {
    throw new Error("Method not implemented.");
  }
  getAuthToken(token: string): Promise<AuthTokenDto | null> {
    throw new Error("Method not implemented.");
  }
  revokeAuthToken(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createUser(user: UserDto, passwordHash: string): Promise<UserDto> {
    await this.client.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        passwordHash: passwordHash
      }
    }));
    return user;
  }



  async storeAuthToken(alias: string, token: AuthTokenDto, expiresAt: number): Promise<void> {
    await this.client.send(new PutCommand({
      TableName: this.authTokenTable,
      Item: {
        token: token.token,
        alias,
        timestamp: token.timestamp,
        expiresAt
      }
    }));
  }


}
