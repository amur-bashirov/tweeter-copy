import { TweeterRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AbstractLambda } from "../AbstractLambda";

export class StatusLambdaHelper<T extends TweeterRequest = TweeterRequest>
  extends AbstractLambda<T, StatusService> {

  public readonly token: string;

  constructor(request: T) {
    super(request, StatusService, ["token"]);

    this.token = request.token!;
  }
}
