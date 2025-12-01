
import { UserDao } from "./UserDao";
import { FollowDao } from "./FollowDao";
import { StatusDao } from "./StatusDao";
import { FeedDao } from "./FeedDao";
import { MediaDao } from "./MediaDao";

export interface DaoFactory {
  createUserDao(): UserDao;
  // createFollowDao(): FollowDao;
  // createStatusDao(): StatusDao;
  // createFeedDao(): FeedDao;
  // createImageDao(): MediaDao;
}
