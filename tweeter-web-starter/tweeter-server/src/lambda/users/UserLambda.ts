import { UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AbstractLambda } from "../AbstractLambda";

export class UserLambda<T extends UserRequest = UserRequest>
  extends AbstractLambda<T, UserService> {

  public readonly alias: string | null;

  constructor(request: T) {
    super(request, UserService, []); 

    this.alias = request.alias ?? null;
  }
}

