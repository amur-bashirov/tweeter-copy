

import { FollowCountResponse, FollowRequest } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";

export const userHandler = async <
  TResponse extends FollowCountResponse
>(
  request: FollowRequest,
  method: "getFolloweeCount" | "getFollowerCount"
): Promise<TResponse> => {

  return new FollowLambda(request, request.user!)
    .run<FollowRequest, TResponse>(
      request,
      method,
      ["user"],
      request.token!,
      request.user
    );
};


