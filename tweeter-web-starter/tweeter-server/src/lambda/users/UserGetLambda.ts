
import { UserRequest, GetUserResponse } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { UserLambda } from "./UserLambda";

export const handler = async (request: UserRequest): Promise<GetUserResponse> => {

  const h = new UserLambda(request);
  const token = LambdaHelper.requireFields(request, "token");

  const userDto = await h.service.getUser(token, h.alias!);

  return LambdaHelper.success<GetUserResponse>({ user: userDto });
};