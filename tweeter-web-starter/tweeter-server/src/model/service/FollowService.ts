import {  UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";

export class FollowService extends Service{

  
  
  constructor(factory: DaoFactory) {
    super(factory);
  }
  

  public async loadMoreFollowees (
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDto | null
    ): Promise<{items: UserDto[], hasMore: boolean}>{ 
      return await this.getUsers(token, userAlias, pageSize, lastItem, "getFollowees")
    };
  
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<{ items: UserDto[], hasMore: boolean}>{
    return await this.getUsers(token, userAlias, pageSize, lastItem, "getFollowers")
  };

  private async getUsers(token: string,userAlias: string, pageSize:number, lastItem: UserDto | null, methodName: string){
    await this.validate(token);
    console.log('validated sussesfuly')
    const fn = (this.followDao as any)[methodName].bind(this.followDao);
    console.log("initiated fn")
    const lastAlias = lastItem ? lastItem.alias : null;
    console.log("initiated lastAlias")
    const { aliases, hasMore } = await fn(userAlias, pageSize, lastAlias);
    console.log(`sussessfuly reatrived users aliases: ${aliases}`)


    // const uniqueAliases = [...new Set(aliases as string[])];
    const items = await this.userDao.batchGetUsers(aliases);
    console.log(`retrieved items: ${items}`)
    return {items, hasMore}
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<{ followerCount: number }> {
    await this.validate(token);
    const followerCount = await this.followDao.getFollowerCount(user.alias);
    return { followerCount };
  }


  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<{ followeeCount: number }> {
    await this.validate(token);
    const followeeCount = await this.followDao.getFolloweeCount(user.alias);
    return { followeeCount };
  }


  public async unfollow (
    token: string,
    userToUnfollow: UserDto
  ): Promise<{followerCount: number , followeeCount: number }> {
    return await this.following(token, userToUnfollow, "unfollow")
  };

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<{status: boolean}> {
    await this.validate(token);
    const follower = await this.getUser(token);
    return {status: await this.followDao.isFollowing(follower.user.alias, selectedUser.alias)}
  };

  public async follow (
    token: string,
    userToFollow: UserDto
  ): Promise<{followerCount: number, followeeCount: number}>{
    return await this.following(token, userToFollow, "follow")
  };

  private async following( token: string, followee: UserDto, methodName: string ): Promise<{followerCount: number, followeeCount: number}>{
    await this.validate(token);

    const follower = await this.getUser(token);

    const followerAlias = follower.user.alias;
    const followeeAlias = followee.alias

    type FollowDaoMethod = (followerAlias: string, followeeAlias: string) => Promise<void>;
    const fn: FollowDaoMethod = (this.followDao as any)[methodName].bind(this.followDao);
    await fn(followerAlias, followeeAlias);


    const followerCount = await this.followDao.getFollowerCount(followee.alias);
    const followeeCount = await this.followDao.getFolloweeCount( followee.alias);
      return {
        followerCount: followerCount,
        followeeCount: followeeCount
      };
  }
  private async getUser(token: string): Promise<{user:UserDto}> {
    const tokenEntry = await this.authDao.getAuthToken(token);
    if (!tokenEntry) throw new Error("Invalid token");
    const follower = await this.userDao.getUserByAlias(tokenEntry.alias);
    if (!follower) throw new Error("User not found");
    return { user: follower };
  }




}