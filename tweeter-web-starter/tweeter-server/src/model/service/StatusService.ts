import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";
import { FeedDao } from "../../dao/interfaces/FeedDao";
import { StatusDao } from "../../dao/interfaces/StatusDao";
import { FeedQueueService } from "./FeedQueueService";

export class StatusService extends Service{

    private feedDao: FeedDao;
    private statusDao: StatusDao;
    private primaryQueue: FeedQueueService;
    private secondaryQueue: FeedQueueService;

    constructor(factory: DaoFactory) {
      super(factory);
      this.feedDao = factory.createFeedDao();
      this.statusDao = factory.createStatusDao();
      this.primaryQueue = new FeedQueueService(
        "https://sqs.us-east-1.amazonaws.com/831926593577/PrimaryQueue"
      );
      this.secondaryQueue = new FeedQueueService(
        "https://sqs.us-east-1.amazonaws.com/831926593577/SecondaryQueue"
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
      console.log(followers.length)

      // 3. Split followers between two queues
      const mid = Math.ceil(followers.length / 2);
      const firstHalf = followers.slice(0, mid);
      const secondHalf = followers.slice(mid);

      const CHUNK_SIZE = 1000; // safe for 256KB limit

      for (const chunk of this.chunk(firstHalf, CHUNK_SIZE)) {
        await this.primaryQueue.enqueueFollowers(chunk, newStatus);
      }

      for (const chunk of this.chunk(secondHalf, CHUNK_SIZE)) {
        await this.secondaryQueue.enqueueFollowers(chunk, newStatus);
      }

      
    }
    private chunk<T>(arr: T[], size: number): T[][] {
      const result = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    }




//   public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
//     await this.validate(token);

//     const tokenEntry = await this.authDao.getAuthToken(token);
//     if (!tokenEntry) throw new Error("Invalid token");

//     // 1. Write to stories table immediately
//     await this.statusDao.postStatus(newStatus);

//     // 2. Load followers
//     const followers = await this.followDao.loadFollowers(tokenEntry.alias);

//     // 3. Send SQS messages
//     for (const followerAlias of followers) {
//       await this.feedQueue.enqueueStatusForFollower(followerAlias, newStatus);
//     }
// }




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