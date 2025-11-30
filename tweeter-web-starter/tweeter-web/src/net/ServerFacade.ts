import {
  AuthToken,
  CreateUserRequest,
  CreateUserResponse,
  FollowCountResponse,
  FollowRequest,
  FollowResponse,
  getFolloweeCountResponse,
  getFollowerCountResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserResponse,
  LoadMoreItemRequest,
  LoadMoreItemsResponse,
  LoginRequest,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  Status,
  StatusDto,
  TweeterRequest,
  TweeterResponse,
  User,
  UserDto,
  UserRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "TODO: Set this value.";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private convertUsers(response: any): User[] | null{
    return response.success && response.items
      ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
      : null;
  }

  private convertStatuses(response: any): Status[] | null{
    return response.success && response.items
      ? response.items.map((dto: StatusDto) => Status.fromDto(dto) as Status)
      : null;
  }

  private catchErrors( response: any, message: string, ...args: any[]) {
    if (response.success) {
      for (const arg of args) {
        if (arg === null || arg === undefined) {
          throw new Error(message);
        }
      }     
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }
  private async fetchAndValidate<REQ extends TweeterRequest, RES extends TweeterResponse, VAL>(
    request: REQ,
    path: string,
    message: string,
    converter?: (res: RES) => VAL | null
  ): Promise<{ value: VAL | null; raw: RES }> {
    const response = await this.clientCommunicator.doPost<REQ, RES>(request, path);
    if (converter !== undefined){
      const value = converter(response);
      this.catchErrors(response, message, value);
      return { value: value!, raw: response };
    }else{
      this.catchErrors(response, message, response.message);
      return { value: null, raw: response };
    }
  }



  

  private async getMoreUsers(
    request: PagedUserItemRequest,
    path: string,
    message: string
  ): Promise<[User[], boolean]> {
    // Use the generic fetchAndValidate helper
    const { value: items, raw: response } = await this.fetchAndValidate<
      PagedUserItemRequest,
      PagedUserItemResponse,
      User[]
    >(request, path, message, res => this.convertUsers(res));

    return [items!, response.hasMore];
  }


  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return await this.getMoreUsers(request, "/followees", `No followees found`)
  }


  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return await this.getMoreUsers(request, "/followers", `No followers found`)
  }

  private isFolloweeCountResponse(
    res: FollowCountResponse
  ): res is getFolloweeCountResponse {
    return (res as getFolloweeCountResponse).followeeCount !== undefined;
  }

  private isFollowerCountResponse(
    res: FollowCountResponse
  ): res is getFollowerCountResponse {
    return (res as getFollowerCountResponse).followerCount !== undefined;
  }


  private async getCount(
    request: FollowRequest,
    path: string,
    getFollowees: boolean
  ): Promise<number> {
    const { value: count, raw: response } = await this.fetchAndValidate<
      FollowRequest,
      FollowCountResponse,
      number
    >(request, path, "No count is found", res =>
      getFollowees
        ? this.isFolloweeCountResponse(res) ? res.followeeCount : null
        : this.isFollowerCountResponse(res) ? res.followerCount : null
    );

    return count!;
  }



  public async getFolloweeCount( 
    request: FollowRequest
  ): Promise<number>{
    return await this.getCount(request,"/followees/getCount", true)
  }

  public async getFollowerCount( 
    request: FollowRequest
  ): Promise<number>{
    return await this.getCount(request,"/followers/getCount", false)
  }

  private async following(
    request: FollowRequest,
    path: string,
    message: string
  ):  Promise<[followerCount: number , followeeCount: number ]>  {
    // Use the generic fetchAndValidate helper
    const { value, raw: response } = await this.fetchAndValidate<
      FollowRequest,
      FollowResponse,
      [number, number]
    >(request, path, message, res => [res.followeeCount, res.followerCount]);

    const [followeeCount, followerCount] = value!;
    return [followeeCount, followerCount];
  }

  public async follow(
    request: FollowRequest,
  ): Promise<[followerCount: number, followeeCount: number]>{
    return await this.following(request, "/followers/follow", 'No count of followees and followers')
  }

  public async unFollow(
    request: FollowRequest,
  ): Promise<[followerCount: number, followeeCount: number]>{
    return await this.following(request, "/followers/unfollow", 'No count of followees and followers')
  }

  public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest
  ): Promise<boolean>{
    const { value, raw: response } = await this.fetchAndValidate<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse,
      boolean
    >(request, "/followers/getIsFollow", 'did not have a boolean if it has Follower or not', res => res.status);
    const status = value!;
    return status;
  }

  private async createUser<REQ extends LoginRequest>(
    request: REQ,
    path: string,
    message: string
  ):  Promise<[User, AuthToken]>  {
    // Use the generic fetchAndValidate helper
    const { value, raw: response } = await this.fetchAndValidate<
      REQ,
      CreateUserResponse,
      [User, AuthToken]
    >(request, path, message, res => [User.fromDto(res.user)!, AuthToken.fromDto(res.token)!]);

    const [user, token] = value!;
    return [user, token];
  }  

  public async register(
    request: CreateUserRequest,
  ): Promise<[User, AuthToken]>  {
    return await this.createUser(request, "/user/create","There is no User and Authtoken");
  }

  public async login(
    request: LoginRequest,
  ): Promise<[User, AuthToken]>  {
    return await this.createUser(request, "/user/login","There is no User and Authtoken");
  }

  public async getUser(
    request: UserRequest
  ): Promise<User | null>{
    const { value, raw: response } = await this.fetchAndValidate<
      UserRequest,
      GetUserResponse,
      User | null
    >(request, "/user/get", "no user found", res => User.fromDto(res.user));
    const user = value;
    return user;
  }

  public async logout(
    request: TweeterRequest
  ): Promise<void> {
    const { value, raw: response } = await this.fetchAndValidate<
      TweeterRequest,
      TweeterResponse,
      User | null
    >(request, "/user/logout", "no user found");
  }

  private async loadMoreItems(
    request: LoadMoreItemRequest,
    path: string,
    message: string
  ): Promise<[Status[], boolean]> {
    // Use the generic fetchAndValidate helper
    const { value, raw: response } = await this.fetchAndValidate<
      LoadMoreItemRequest,
      LoadMoreItemsResponse,
      Status[]
    >(request, path, message, res => this.convertStatuses(res));

    const statuses = value!
    return [statuses, response.bool];
  } 

  public async loadMoreFeedItems(
    request: LoadMoreItemRequest
  ): Promise<[Status[], boolean]>{
    return await this.loadMoreItems(request, "/status/loadMoreFeeds", "No feeds found")
  }

  public async loadMoreStoryItems(
    request: LoadMoreItemRequest
  ): Promise<[Status[], boolean]>{
    return await this.loadMoreItems(request, "/status/loadMoreStories", "No stories found")
  }
  
  public async postStatus(
    request: PostStatusRequest
  ): Promise<void> {
    const { value, raw: response } = await this.fetchAndValidate<
      PostStatusRequest,
      TweeterResponse,
      User | null
    >(request, "/status/post", "did not post");
  }
}