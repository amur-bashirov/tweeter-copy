import { Status, FakeData, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";

export class StatusService extends Service{

    constructor(factory: DaoFactory) {
      super(factory);
    }


    public async loadMoreFeedItems(
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<{ statuses: StatusDto[], bool: boolean }> {

      const lastStatus = lastItem ? Status.fromDto(lastItem) : null;

      const [statuses, bool] =
        FakeData.instance.getPageOfStatuses(lastStatus, pageSize);

      return { statuses: statuses.map(s => s.toDto()), bool };
    }

    
    public async loadMoreStoryItems(
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<{ statuses: StatusDto[], bool: boolean }> {

      const lastStatus = lastItem ? Status.fromDto(lastItem) : null;

      const [statuses, bool] =
        FakeData.instance.getPageOfStatuses(lastStatus, pageSize);

      return { statuses: statuses.map(s => s.toDto()), bool };
    }


    public async postStatus(
    token: string,
    newStatus: StatusDto
    ): Promise<void>{
      // Pause so we can see the logging out message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));

      // TODO: Call the server to post the status
    };
    
}