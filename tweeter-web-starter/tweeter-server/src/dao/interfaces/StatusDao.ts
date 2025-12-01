import { StatusDto } from "tweeter-shared";

export interface StatusDao {
  postStatus(status: StatusDto): Promise<void>;

  getStory(
    alias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<{ statuses: StatusDto[]; hasMore: boolean }>;
}
