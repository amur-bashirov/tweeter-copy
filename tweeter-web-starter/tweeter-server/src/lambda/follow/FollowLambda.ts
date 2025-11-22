import {  FollowRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { LambdaHelper } from "../LambdaHelper";

export class FollowLambda<T extends FollowRequest>{

  public readonly service: FollowService;
  public readonly token: string | null;
  public readonly request: T;

  constructor(request: T) {
    this.service = new FollowService();
    this.request = request;

    
    LambdaHelper.requireFields(request, "token");
    this.token = request.token!;


  }
}
