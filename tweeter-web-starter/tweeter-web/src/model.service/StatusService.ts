import { AuthToken, Status, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService implements Service{
  private server = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const [dtos, hasMore] = await this.server.loadMoreFeedItems({
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem?.dto ?? null,
    });

    const statuses = dtos.map(dto => Status.fromDto(dto));

    return [statuses, hasMore];
  };
  
  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await this.server.loadMoreStoryItems({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    });
  };

  public async postStatus(
  authToken: AuthToken,
  newStatus: Status
  ): Promise<void>{
    return await this.server.postStatus({
      token: authToken.token,
      newStatus: newStatus?.dto ?? null
    });
  };
    
}