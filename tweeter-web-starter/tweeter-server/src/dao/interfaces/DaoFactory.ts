
import { UserDao } from "./UserDao";
import { FollowDao } from "./FollowDao";
import { StatusDao } from "./StatusDao";
import { FeedDao } from "./FeedDao";
import { MediaDao } from "./MediaDao";
import { AuthDao } from "./AuthDao";

export interface DaoFactory {
  createUserDao(): UserDao;
  createAuthDao(): AuthDao;
  createFollowDao(): FollowDao;
  createStatusDao(): StatusDao;
  createFeedDao(): FeedDao;
  createImageDao(): MediaDao;
}
