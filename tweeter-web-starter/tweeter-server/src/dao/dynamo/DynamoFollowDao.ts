import { UserDto } from "tweeter-shared";
import { FollowDao } from "../interfaces/FollowDao";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";



export class DynamoFollowDao implements FollowDao{



    private client: DynamoDBDocumentClient;
    private readonly TABLE_NAME = "follows";
    private readonly INDEX_NAME = "follows_index";
    
    constructor() {
    const baseClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(baseClient);
    }


    async follow(followerAlias: string, followeeAlias: string): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.TABLE_NAME,
                Item: {
                followerAlias,
                followeeAlias,
                },
                ConditionExpression: "attribute_not_exists(followerAlias) AND attribute_not_exists(followeeAlias)"
            })
        );
    }
    async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
        await this.client.send(
            new DeleteCommand({
                TableName: this.TABLE_NAME,
                Key: {
                followerAlias,
                followeeAlias,
                },
            })
        );
    }

    // -----------------------------------------------------
    // Check if follower follows followee
    // -----------------------------------------------------
    async isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.TABLE_NAME,
                Key: {
                followerAlias,
                followeeAlias,
                },
            })
        );
        return !!result.Item;
    }

    // -----------------------------------------------------
    // Get ALL followers of a user (using GSI)
    // -----------------------------------------------------
    async getFollowers(alias: string, pageSize: number, lastFollowerAlias: string | null): Promise<{ aliases: string[]; hasMore: boolean }> {
        const params: any = {
        TableName: this.TABLE_NAME,
        IndexName: this.INDEX_NAME,
        KeyConditionExpression: "followeeAlias = :alias",
        ExpressionAttributeValues: {
            ":alias": alias,
        },
        Limit: pageSize,
        };

        if (lastFollowerAlias) {
        params.ExclusiveStartKey = {
            followeeAlias: alias,
            followerAlias: lastFollowerAlias,
        };
        }

        const result = await this.client.send(new QueryCommand(params));


        const aliases = (result.Items ?? [])
            .map(i => i.followerAlias?.S)
            .filter((alias): alias is string => typeof alias === "string");



        return {
        aliases,
        hasMore: !!result.LastEvaluatedKey,
        };
    }

    // -----------------------------------------------------
    // Get ALL followees of a user (main table)
    // -----------------------------------------------------
    async getFollowees(alias: string, pageSize: number, lastFolloweeAlias: string | null): Promise<{ aliases: string[];  hasMore: boolean }> {
        const params: any = {
        TableName: this.TABLE_NAME,
        KeyConditionExpression: "followerAlias = :alias",
        ExpressionAttributeValues: {
            ":alias": alias,
        },
        Limit: pageSize,
        };

        if (lastFolloweeAlias) {
        params.ExclusiveStartKey = {
            followerAlias: alias,
            followeeAlias: lastFolloweeAlias,
        };
        }

        const result = await this.client.send(new QueryCommand(params));

        const aliases = (result.Items ?? [])
            .map(i => i.followerAlias?.S)
            .filter((alias): alias is string => typeof alias === "string");



        return {
        aliases,
        hasMore: !!result.LastEvaluatedKey,
        };
    }

    // -----------------------------------------------------
    // Count followers using GSI
    // -----------------------------------------------------
    async getFollowerCount(alias: string): Promise<number> {
        const result = await this.client.send(
        new QueryCommand({
            TableName: this.TABLE_NAME,
            IndexName: this.INDEX_NAME,
            KeyConditionExpression: "followeeAlias = :alias",
            ExpressionAttributeValues: {
            ":alias": { S: alias },
            },
            Select: "COUNT",
        })
        );

        return result.Count ?? 0;
    }

    // -----------------------------------------------------
    // Count followees using main table
    // -----------------------------------------------------
    async getFolloweeCount(alias: string): Promise<number> {
        const result = await this.client.send(
        new QueryCommand({
            TableName: this.TABLE_NAME,
            KeyConditionExpression: "followerAlias = :alias",
            ExpressionAttributeValues: {
            ":alias": { S: alias },
            },
            Select: "COUNT",
        })
        );

        return result.Count ?? 0;
    }
    
}