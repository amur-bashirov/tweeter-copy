import { DynamoFeedDao } from "../../dao/dynamo/DynamoFeedDao";
import { StatusDto } from "tweeter-shared";

const feedDao = new DynamoFeedDao();

export const add = async (event: any) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    const followers: string[] = body.followers;
    const status: StatusDto = body.status;

    // Convert followers to batch-friendly input
    const items = followers.map(followerAlias => ({
      followerAlias,
      status
    }));

    // Use your existing batch method
    await feedDao.addStatusesToFeedBatch(items);
  }
}