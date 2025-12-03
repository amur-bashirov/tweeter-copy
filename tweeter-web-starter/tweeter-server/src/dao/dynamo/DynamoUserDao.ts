
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
 
  async getUserByAliasWithHash(alias: string): Promise<{ user: UserDto | null; passwordHash?: string }> {
    const result = await this.client.send(new GetCommand({
      TableName: this.tableName,
      Key: { alias }
    }));


    if (!result.Item) return { user: null };


    const { passwordHash, ...userDto } = result.Item;
    return { 
        user: userDto as UserDto, 
        passwordHash 
      };
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
  async getAuthToken(token: string): Promise< { alias: string; expiresAt: number; dto: AuthTokenDto } | null> {
    const result = await this.client.send(new GetCommand({
      TableName: this.authTokenTable,
      Key: { token }
    }));


    if (!result.Item) return null;
    const { alias, expiresAt, ...authDto } = result.Item
    const dto = authDto as AuthTokenDto;
    return {alias, expiresAt, dto}
}


  async revokeAuthToken(token: string): Promise<void> {
    await this.client.send(new DeleteCommand({
      TableName: this.authTokenTable,
      Key: { token }
    }));
  }

  
  async getUserByAlias(alias: string): Promise<UserDto | null> {
    const result = await this.client.send(new GetCommand({
      TableName: this.tableName,
      Key: { alias }
    }));


    if (!result.Item) return null;


    const { passwordHash, ...userDto } = result.Item;
    return userDto as UserDto;
  }

  async updateTokenExpiration(tokenString: string): Promise<void>{
    const token = await this.getAuthToken(tokenString);
    if (!token) throw new Error("Token not found");

    await this.revokeAuthToken(tokenString);
    await this.storeAuthToken(token.alias, token.dto);


  }





  async storeAuthToken(alias: string, token: AuthTokenDto): Promise<void> {
    const expiresAt = Date.now() + 2 * 60 * 1000;
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
