
import { UserDao } from "../interfaces/UserDao";
import { UserDto } from "tweeter-shared";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoUserDao implements UserDao {

  private client: DynamoDBDocumentClient;
  private readonly tableName = "TweeterUsers";

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

  async getUserByAlias(alias: string): Promise<UserDto | null> {
    const result = await this.client.send(new GetCommand({
      TableName: this.tableName,
      Key: { alias }
    }));


    if (!result.Item) return null;


    const { passwordHash, ...userDto } = result.Item;
    return userDto as UserDto;
  }

}
