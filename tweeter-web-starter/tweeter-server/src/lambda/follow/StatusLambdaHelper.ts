

import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";
export const userHandler = async (
  request: FollowRequest,
  method: "follow" | "unfollow"
): Promise<FollowResponse> => {

  return new FollowLambda(request, request.user!).run<FollowRequest, FollowResponse>(
    request,            
    method,             
    ["user"],                      
    request.token!,     
    request.user!     
  )
};
