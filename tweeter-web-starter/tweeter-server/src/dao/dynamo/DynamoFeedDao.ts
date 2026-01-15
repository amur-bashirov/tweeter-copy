import { StatusDto, UserDto } from "tweeter-shared";
import { FeedDao } from "../interfaces/FeedDao";
import { DynamoDBClient, QueryCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { BatchWriteItemCommand, WriteRequest } from "@aws-sdk/client-dynamodb";

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
    async addStatusesToFeedBatch(
    items: { followerAlias: string; status: StatusDto }[]
    ): Promise<void> {
        const TABLE = "FeedsTable";
        const MAX_BATCH = 25;

        console.log("Starting batch write. Total items:", items.length);

        const allRequests: WriteRequest[] = items.map(i => ({
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

        for (let i = 0; i < allRequests.length; i += MAX_BATCH) {
            let batch: WriteRequest[] = allRequests.slice(i, i + MAX_BATCH);
            let attempt = 0;

            console.log(`Writing chunk ${i / MAX_BATCH + 1}, size=${batch.length}`);

            while (batch.length > 0) {
            attempt++;
            console.log(`Attempt ${attempt}, sending ${batch.length} items`);

            const result = await this.client.send(
                new BatchWriteItemCommand({
                RequestItems: {
                    [TABLE]: batch
                }
                })
            );

            const unprocessed = result.UnprocessedItems?.[TABLE] ?? [];

            console.log(
                `Attempt ${attempt}: unprocessed = ${unprocessed.length}`
            );

            batch = unprocessed as WriteRequest[];

            if (batch.length > 0) {
                await new Promise(res => setTimeout(res, 50));
            }
            }
        }

        console.log("✅ Batch write fully completed");
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