import {  FollowRequest, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { LambdaHelper } from "../LambdaHelper";

export class FollowLambda<T extends FollowRequest>{

  public readonly service: FollowService;
  public readonly token: string | null;
  public readonly request: T;
  public readonly user: UserDto

  constructor(request: T,
     user: UserDto = { alias: "", firstName: "", lastName: "", imageUrl: "" }
    ) {
    this.service = new FollowService();
    this.request = request;
    
    LambdaHelper.requireFields(request, "user");
    this.user = user;
    
    LambdaHelper.requireFields(request, "token");
    this.token = request.token!;


  }
}
