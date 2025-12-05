import { UserDto } from "tweeter-shared";
import { FollowDao } from "../interfaces/FollowDao";
import { DynamoDBClient, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";



export class DynamoFollowDao implements FollowDao{



    private client: DynamoDBDocumentClient;
    private readonly TABLE_NAME = "FollowTable";
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
                ConditionExpression: "attribute_not_exists(followerAlias)"
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
        const params: QueryCommandInput = {
            TableName: this.TABLE_NAME,
            IndexName: this.INDEX_NAME,
            KeyConditionExpression: "followeeAlias = :alias",
            ExpressionAttributeValues: {
                ":alias": { S: alias } 
            },
            Limit: pageSize
        };

        if (lastFollowerAlias) {
            console.log(`reached this line the lastFollowerAlias is ${lastFollowerAlias}`)
            params.ExclusiveStartKey = {
                followerAlias: { S: lastFollowerAlias },
                followeeAlias: { S: alias }
            };
        }

        console.log(`about to send the query command, if it is the last one it means something happened here. Params: ${params}`)
        const result = await this.client.send(new QueryCommand(params));
        console.log(`Did not return error at the momement of sending QueryCommand in DynamoFollowDao. Here are params: ${params}`)


        const aliases = (result.Items ?? [])
            .map(i => i.followerAlias?.S)
            .filter((alias): alias is string => typeof alias === "string");

        console.log(`retireved all aliases successfuly: ${aliases}`)



        return {
        aliases,
        hasMore: !!result.LastEvaluatedKey,
        };
    }

    // -----------------------------------------------------
    // Get ALL followees of a user (main table)
    // -----------------------------------------------------
    async getFollowees(alias: string, pageSize: number, lastFolloweeAlias: string | null): Promise<{ aliases: string[];  hasMore: boolean }> {
        const params: QueryCommandInput = {
            TableName: this.TABLE_NAME,
            IndexName: "GSI_Followees",
            KeyConditionExpression: "followerAlias = :alias",
            ExpressionAttributeValues: {
                ":alias": { S: alias } 
            },
            Limit: pageSize
        };

        if (lastFolloweeAlias) {
            console.log(`reached this line the lastFollowerAlias is ${lastFolloweeAlias}`)
            params.ExclusiveStartKey = {
                followerAlias: { S: alias },
                followeeAlias: { S: lastFolloweeAlias },
            };
        }

        const result = await this.client.send(new QueryCommand(params));

        const aliases = (result.Items ?? [])
            .map(i => i.followeeAlias?.S)
            .filter((x): x is string => typeof x === "string");



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