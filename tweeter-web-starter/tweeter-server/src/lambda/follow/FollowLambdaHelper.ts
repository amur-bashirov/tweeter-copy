import { FollowRequest, UserDto } from "tweeter-shared";
import { AbstractLambda } from "../AbstractLambda";
import { FollowService } from "../../model/service/FollowService";

export class FollowLambda<T extends FollowRequest = FollowRequest> extends AbstractLambda<T, FollowService> {
  public readonly user: UserDto;
  public readonly token: string;

  constructor(request: T, user: UserDto = { alias: "", firstName: "", lastName: "", imageUrl: "" }) {
    super(request, FollowService, [ "token"]);
    this.user = user;
    this.token = request.token!;
  }
}


