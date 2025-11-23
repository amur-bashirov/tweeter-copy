import { FollowRequest, FollowResponse } from "tweeter-shared";
import { userHandler } from "./StatusLambdaHelper";


export const handler = async(request: FollowRequest): Promise<FollowResponse> => {
    return userHandler(request, "unfollow");
}