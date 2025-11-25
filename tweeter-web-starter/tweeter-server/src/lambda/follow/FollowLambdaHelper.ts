import { FollowRequest, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AbstractLambda } from "../AbstractLambda";

export class FollowLambda<T extends FollowRequest = FollowRequest>
  extends AbstractLambda<T, FollowService> {

  public readonly user: UserDto;
  public readonly token: string;

  constructor(
    request: T,
    user: UserDto = { alias: "", firstName: "", lastName: "", imageUrl: "" }
  ) {
    super(request, FollowService, ["token", "user"]);

    this.user = user;
    this.token = request.token!;
  }
}

