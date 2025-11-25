

import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";
import { LambdaRunner } from "../LambdaRunner";
import { FollowService } from "../../model/service/FollowService";

export const userHandler = async (
  request: FollowRequest,
  method: "follow" | "unfollow"
): Promise<FollowResponse> => {

  return LambdaRunner.run<FollowService, FollowRequest, FollowResponse>(
    FollowLambda,       
    request,            
    method,             
    [],                 
    request.user!,      
    request.token!,     
    request.user!       
  );
};
