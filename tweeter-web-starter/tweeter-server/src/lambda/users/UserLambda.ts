import {  UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { LambdaHelper } from "../LambdaHelper";

export class UserLambda<T extends UserRequest > {

  public readonly service: UserService;
  public readonly alias: string | null;
  public readonly request: T;

  constructor(request: T) {
    this.service = new UserService();
    this.request = request;

    
    if (request.alias !== undefined) {
      LambdaHelper.requireFields(request, "alias");
      this.alias = request.alias!;
    } else{
      this.alias = null;
    }

  }
}
