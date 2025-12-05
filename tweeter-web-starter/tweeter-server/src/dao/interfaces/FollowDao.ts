

export interface FollowDao {
  follow(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;

  isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean>;

  getFollowers(
    alias: string,
    pageSize: number,
    lastFollowerAlias: string | null
  ): Promise<{ aliases: string[]; hasMore: boolean }>;

  getFollowees(
    alias: string,
    pageSize: number,
    lastFolloweeAlias: string | null
  ): Promise<{ aliases: string[]; hasMore: boolean }>;

  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;
}

