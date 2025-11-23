

import { FollowRequest, FollowResponse } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { FollowLambda } from "./FollowLambdaHelper";

export const userHandler = async (
  request: FollowRequest,
  method: "follow" | "unfollow"
): Promise<FollowResponse> => {
    const h = new FollowLambda(request, request.user!); 
    const serviceMethod = h.service[method].bind(h.service);
    const [followerCount, followeeCount] = await serviceMethod(h.token!, h.user);

    return LambdaHelper.success<FollowResponse>({
    followerCount: followerCount,
    followeeCount: followeeCount
    });
};