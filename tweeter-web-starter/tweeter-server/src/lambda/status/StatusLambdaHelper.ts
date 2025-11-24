import { TweeterRequest, UserDto } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { StatusService } from "../../model/service/StatusService";

export class StatusLambdaHelper<T extends TweeterRequest>{

  public readonly service: StatusService;
  public readonly token: string | null;

  constructor(request: T
    ) {
    this.service = new StatusService();

    
    LambdaHelper.requireFields(request, "token");
    this.token = request.token!;


  }
}
