import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";
import { FeedDao } from "../../dao/interfaces/FeedDao";
import { StatusDao } from "../../dao/interfaces/StatusDao";
import { FeedQueueService } from "./FeedQueueService";

export class StatusService extends Service{

    private feedDao: FeedDao;
    private statusDao: StatusDao;
    private feedQueue: FeedQueueService;

    constructor(factory: DaoFactory) {
      super(factory);
      this.feedDao = factory.createFeedDao();
      this.statusDao = factory.createStatusDao();
        this.feedQueue = new FeedQueueService(
        "https://sqs.us-east-1.amazonaws.com/831926593577/FeedQueue"
      );
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


  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.validate(token);

    const tokenEntry = await this.authDao.getAuthToken(token);
    if (!tokenEntry) throw new Error("Invalid token");

    // 1. Write to stories table immediately
    await this.statusDao.postStatus(newStatus);

    // 2. Load followers
    const followers = await this.followDao.loadFollowers(tokenEntry.alias);

    // 3. Send SQS messages
    for (const followerAlias of followers) {
      await this.feedQueue.enqueueStatusForFollower(followerAlias, newStatus);
    }
}




    // public async postStatus(
    // token: string,
    // newStatus: StatusDto
    // ): Promise<void>{
    //   await this.validate(token);

    //   const tokenEntry = await this.authDao.getAuthToken(token);
    //   if (!tokenEntry) throw new Error("Invalid token");

    //   await this.statusDao.postStatus(newStatus);

    //   const aliases = await this.followDao.loadFollowers(tokenEntry.alias)
    //   console.log(`Here are all the followers ${aliases}`);

    //   const batchItems = aliases.map(a => ({
    //       followerAlias: a,
    //       status: newStatus
    //   }));

    //   await this.feedDao.addStatusesToFeedBatch(batchItems);
      
    //   // for (const followerAlias of aliases) {
    //   //   await this.feedDao.addStatusToFeed(followerAlias, newStatus);
    //   // }

    // };
    
}