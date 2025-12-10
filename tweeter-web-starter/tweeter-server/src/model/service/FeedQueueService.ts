import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { StatusDto } from "tweeter-shared";

export class FeedQueueService {
  private client: SQSClient;
  private queueUrl: string;

  constructor(queueUrl: string) {
    this.client = new SQSClient({});
    this.queueUrl = queueUrl;
  }

  async enqueueStatusForFollower(followerAlias: string, status: StatusDto) {
    const message = {
      followerAlias,
      status
    };

    await this.client.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message)
      })
    );
  }
}
