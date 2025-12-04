import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AuthDao } from "../interfaces/AuthDao";
import { AuthTokenDto } from "tweeter-shared";




export class DynamoAuthDao implements AuthDao{
    private client: DynamoDBDocumentClient;
    private readonly authTokenTable = "TweeterAuthTokens";

    constructor() {
        const baseClient = new DynamoDBClient({});
        this.client = DynamoDBDocumentClient.from(baseClient);
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