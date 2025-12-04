

import { DaoFactory } from "../interfaces/DaoFactory";
import { UserDao } from "../interfaces/UserDao";
import { FollowDao } from "../interfaces/FollowDao";
import { StatusDao } from "../interfaces/StatusDao";
import { FeedDao } from "../interfaces/FeedDao";
import { MediaDao } from "../interfaces/MediaDao";

// Dynamo implementations (we write these later)
import { AuthDao } from "../interfaces/AuthDao";
import { DynamoAuthDao } from "./DynamoAuthDao";
// import { DynamoFollowDao } from "./DynamoFollowDao";
// import { DynamoStatusDao } from "./DynamoStatusDao";
// import { DynamoFeedDao } from "./DynamoFeedDao";
import { S3MediaDao } from "./S3MediaDao";
import { DynamoUserDao } from "./DynamoUserDao";

export class DynamoDaoFactory implements DaoFactory {
  createAuthDao(): AuthDao {
    return new DynamoAuthDao();
  }

  createUserDao(): UserDao {
    return new DynamoUserDao();
  }

  // createFollowDao(): FollowDao {
  //   return new DynamoFollowDao();
  // }

  // createStatusDao(): StatusDao {
  //   return new DynamoStatusDao();
  // }

  // createFeedDao(): FeedDao {
  //   return new DynamoFeedDao();
  // }

  createImageDao(): MediaDao {
    return new S3MediaDao();
  }
}