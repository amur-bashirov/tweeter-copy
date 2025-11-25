

import { FollowCountResponse, FollowRequest } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";
import { LambdaRunner } from "../LambdaRunner";
import { FollowService } from "../../model/service/FollowService";

export const userHandler = async (
  request: FollowRequest,
  method: "getFolloweeCount" | "getFollowerCount"
): Promise<FollowCountResponse> => {

  return LambdaRunner.run<
    FollowService,
    FollowRequest,
    FollowCountResponse
>(
    FollowLambda,       
    request,            
    method,             
    [],                 
    request.user!,      
    request.token!,     
    request.user!      
  );
};
