

import { FollowCountResponse, FollowRequest } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";

export const userHandler = async (
  request: FollowRequest,
  method: "getFolloweeCount" | "getFollowerCount"
): Promise<FollowCountResponse> => {


  return new FollowLambda(request, request.user!).run<FollowRequest,FollowCountResponse>(
    request,
    method,
    [],
    request.token!,
    request.user
  );
};

