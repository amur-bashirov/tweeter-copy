

import { FollowCountResponse, FollowRequest } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { FollowLambda } from "./FollowLambdaHelper";

export const userHandler = async (
  request: FollowRequest,
  method: "getFolloweeCount" | "getFollowerCount"
): Promise<FollowCountResponse> => {
  const h = new FollowLambda(request, request.user!); 

  const serviceMethod = h.service[method].bind(h.service);

  const number = await serviceMethod(
    h.token!,
    h.user
  );

  return LambdaHelper.success<FollowCountResponse>({
    number
  });
};
