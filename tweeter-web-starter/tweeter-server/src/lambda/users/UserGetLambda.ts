
import { UserRequest, GetUserResponse } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { UserLambda } from "./UserLambda";
import { LambdaRunner } from "../LambdaRunner";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: UserRequest): Promise<GetUserResponse> => {

  return LambdaRunner.run<UserService, UserRequest,GetUserResponse >(
    UserLambda,
    request,
    "getUser",
    ["token"],
    undefined,
    request.token,
    request.alias
  )
};