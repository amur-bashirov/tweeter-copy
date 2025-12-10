import { StatusDto, UserDto } from "tweeter-shared";
import { FeedDao } from "../interfaces/FeedDao";
import { DynamoDBClient, QueryCommand, PutItemCommand, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
export class DynamoFeedDao implements FeedDao{

      private client: DynamoDBDocumentClient;
      private readonly feedTable = "FeedsTable";
    
      constructor() {
          const baseClient = new DynamoDBClient({});
          this.client = DynamoDBDocumentClient.from(baseClient);
      }    


    async addStatusToFeed(followerAlias: string, status: StatusDto): Promise<void> {
        const params = {
            TableName: "FeedsTable",
            Item: {
                userAlias: {S: followerAlias},
                authorAlias: { S: status.user.alias },
                authorFirstName: { S: status.user.firstName },
                authorLastName: { S: status.user.lastName },
                authorImageUrl: { S: status.user.imageUrl },
                timestamp: { N: status.timestamp.toString() },
                text: { S: status.post }
            }
        }
        await this.client.send(new PutItemCommand(params))
    }

    async addStatusesToFeedBatch(items: { followerAlias: string; status: StatusDto }[]) {
        const requests = items.map(i => ({
            PutRequest: {
                Item: {
                    userAlias: { S: i.followerAlias },
                    authorAlias: { S: i.status.user.alias },
                    authorFirstName: { S: i.status.user.firstName },
                    authorLastName: { S: i.status.user.lastName },
                    authorImageUrl: { S: i.status.user.imageUrl },
                    timestamp: { N: i.status.timestamp.toString() },
                    text: { S: i.status.post }
                }
            }
        }));

        // DynamoDB BatchWrite max = 25 items
        while (requests.length > 0) {
            const batch = requests.splice(0, 25);

            await this.client.send(
                new BatchWriteItemCommand({
                    RequestItems: {
                        FeedsTable: batch
                    }
                })
            );
        }
    }




    async getFeed(alias: string, pageSize: number, lastTimestamp: number | null): Promise<{ statuses: StatusDto[]; hasMore: boolean; }> {

        const params: any = {
            TableName: this.feedTable,
            KeyConditionExpression: "userAlias = :alias",
            ExpressionAttributeValues: {
                ":alias": { S: alias } 
            },
            ScanIndexForward: false,
            Limit: pageSize
        };

        if (lastTimestamp !== null) {
            params.ExclusiveStartKey = {
                authorAlias: {S: alias},
                timestamp: {N: lastTimestamp.toString()}
            };
        }

        const result = await this.client.send(new QueryCommand(params));

        const statuses: StatusDto[] = (result.Items ?? []).map(item => ({
            user: {
                alias: item.authorAlias?.S ?? "",
                firstName: item.authorFirstName?.S ?? "",
                lastName: item.authorLastName?.S ?? "",
                imageUrl: item.authorImageUrl?.S ?? ""
            } as UserDto,
            timestamp: Number(item.timestamp?.N  ?? "0"),
            post: item.text?.S ?? ""

        }));



        return {
            statuses,
            hasMore: !!result.LastEvaluatedKey
        };
    }
}