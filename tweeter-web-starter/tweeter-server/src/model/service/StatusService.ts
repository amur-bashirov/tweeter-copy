import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";
import { FeedDao } from "../../dao/interfaces/FeedDao";
import { StatusDao } from "../../dao/interfaces/StatusDao";

export class StatusService extends Service{

    private feedDao: FeedDao;
    private statusDao: StatusDao

    constructor(factory: DaoFactory) {
      super(factory);
      this.feedDao = factory.createFeedDao();
      this.statusDao = factory.createStatusDao();
    }


    public async loadMoreFeedItems(
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<{ statuses: StatusDto[], bool: boolean }> {
      return await this.loadMore(token, userAlias, pageSize, lastItem,this.feedDao.getFeed.bind(this.feedDao));;
    }

    
    public async loadMoreStoryItems(
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<{ statuses: StatusDto[], bool: boolean }> {
      return await this.loadMore(token, userAlias, pageSize, lastItem,this.statusDao.getStory.bind(this.feedDao));
    }

    private async loadMore(
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null,
      fetchFn: (alias: string, pageSize: number, last: number | null) 
        => Promise<{statuses: StatusDto[], hasMore: boolean}>
    ): Promise<{ statuses: StatusDto[], bool: boolean }> {
      await this.validate(token);

      const lastStatus = lastItem ? Status.fromDto(lastItem) : null;

      const { statuses, hasMore } =
        await fetchFn(userAlias, pageSize, lastStatus?.timestamp ?? null);

      return { statuses, bool: hasMore };
    }



    public async postStatus(
    token: string,
    newStatus: StatusDto
    ): Promise<void>{
      await this.validate(token);

      const tokenEntry = await this.authDao.getAuthToken(token);
      if (!tokenEntry) throw new Error("Invalid token");

      await this.statusDao.postStatus(newStatus);

      const aliases = await this.followDao.loadFollowers(tokenEntry.alias)
      console.log(`Here are all the followers ${aliases}`)
      
      for (const followerAlias of aliases) {
        await this.feedDao.addStatusToFeed(followerAlias, newStatus);
      }

    };
    
}