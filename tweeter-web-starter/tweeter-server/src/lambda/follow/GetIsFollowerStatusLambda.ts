import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";
import { LambdaRunner } from "../LambdaRunner";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {

  return LambdaRunner.run<
      FollowService,
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
  >(
    FollowLambda,
    request,
    "getIsFollowerStatus",
    ["selectedUser"],   
    request.user!,      
    request.token!,
    request.user!,
    request.selectedUser!
  );
};
