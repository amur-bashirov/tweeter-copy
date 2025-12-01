import { StatusDto } from "tweeter-shared";

export interface FeedDao {
  addStatusToFeed(
    followerAlias: string,
    status: StatusDto
  ): Promise<void>;

  getFeed(
    alias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<{ statuses: StatusDto[]; hasMore: boolean }>;
}
