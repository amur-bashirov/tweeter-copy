import { Status, FakeData, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service{


    public async loadMoreFeedItems(
          token: string,
          userAlias: string,
          pageSize: number,
          lastItem: StatusDto | null
        ): Promise<{statuses: StatusDto[], bool: boolean}> {
          // TODO: Replace with the result of calling server
          const [statuses, bool] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem!), pageSize);
          return { statuses: statuses.map(s => s.toDto()), bool };
        };
    
    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<{statuses: StatusDto[], bool: boolean}> {
        // TODO: Replace with the result of calling server
          const [statuses, bool] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem!), pageSize);
          return { statuses: statuses.map(s => s.toDto()), bool };
      };

    public async postStatus(
    token: string,
    newStatus: StatusDto
    ): Promise<void>{
      // Pause so we can see the logging out message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      // TODO: Call the server to post the status
    };
    
}