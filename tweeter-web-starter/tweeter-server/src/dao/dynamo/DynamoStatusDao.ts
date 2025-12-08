import { StatusDto, UserDto } from "tweeter-shared";
import { StatusDao } from "../interfaces/StatusDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoStatusDao implements StatusDao {
    private client: DynamoDBDocumentClient;
    private readonly storyTable = "StoriesTable"; 

    constructor() {
        const baseClient = new DynamoDBClient({});
        this.client = DynamoDBDocumentClient.from(baseClient);
    }

    async postStatus(status: StatusDto): Promise<void> {
        const params = {
            TableName: "StoriesTable",
            Item: {
                authorAlias: status.user.alias,
                authorFirstName: status.user.firstName,
                authorLastName: status.user.lastName,
                authorImageUrl: status.user.imageUrl,
                timestamp: status.timestamp,
                text: status.post
            }
        };

        await this.client.send(new PutCommand(params));
    }

    async getStory(alias: string, pageSize: number, lastTimestamp: number | null): Promise<{ statuses: StatusDto[]; hasMore: boolean }> {
        const params: any = {
            TableName: "StoriesTable",
            KeyConditionExpression: "authorAlias = :alias",
            ExpressionAttributeValues: {
                ":alias": alias
            },
            ScanIndexForward: false,
            Limit: pageSize
        };

        if (lastTimestamp !== null) {
            params.ExclusiveStartKey = {
                authorAlias: alias,
                timestamp: lastTimestamp
            };
        }

        const result = await this.client.send(new QueryCommand(params));

        const statuses: StatusDto[] = (result.Items ?? []).map(item => ({
            user: {
                alias: item.authorAlias,
                firstName: item.authorFirstName,
                lastName: item.authorLastName,
                imageUrl: item.authorImageUrl
            } as UserDto,
            timestamp: item.timestamp,
            post: item.text
        }));

        return {
            statuses,
            hasMore: !!result.LastEvaluatedKey
        };
    }
}
