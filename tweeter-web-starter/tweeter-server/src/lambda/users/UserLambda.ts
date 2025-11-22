import {  UserRequest, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { LambdaHelper } from "../LambdaHelper";

export class UserLambda<T extends UserRequest > {

  public readonly service: UserService;
  public readonly alias: string;
  public readonly token: AuthToken | null;
  public readonly request: T;

  constructor(request: T) {
    this.service = new UserService();
    this.request = request;

    
    LambdaHelper.requireFields(request, "alias");
    this.alias = request.alias!; 
    
    this.token = LambdaHelper.requireToken(request.token);

  }
}
