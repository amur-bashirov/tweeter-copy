import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService implements Service{
  private server = new ServerFacade();

  public async loadMoreFollowees (
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: User | null
    ): Promise<[User[], boolean]>{
      return await this.server.getMoreFollowees({
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem?.dto ?? null,
      });
    };
  
  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {

    return await this.server.getMoreFollowers({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    });
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {

    return await this.server.getFollowerCount({
      token: authToken.token,
      user: user?.dto ?? null,
    });
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {

    return await this.server.getFolloweeCount({
      token: authToken.token,
      user: user?.dto ?? null,
    });
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {

    return await this.server.unFollow({
      token: authToken.token,
      user: userToUnFollow?.dto ?? null,
    });
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {

    return await this.server.getIsFollowerStatus({
      token: authToken.token,
      user: user?.dto ?? null,
      selectedUser: selectedUser?.dto ?? null,
    });
  }


  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {

    return await this.server.follow({
      token: authToken.token,
      user: userToFollow?.dto ?? null,
    });
  }


  
}