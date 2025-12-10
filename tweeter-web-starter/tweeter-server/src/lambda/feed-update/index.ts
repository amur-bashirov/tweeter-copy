import { DynamoFeedDao } from "../../dao/dynamo/DynamoFeedDao";

const feedDao = new DynamoFeedDao();

export const handler = async (event: any) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    await feedDao.addStatusToFeed(body.followerAlias, body.status);
  }
};
