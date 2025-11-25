import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusLambdaHelper } from "./StatusLambdaHelper";
import { LambdaRunner } from "../LambdaRunner";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {

  return LambdaRunner.run<StatusService, PostStatusRequest, TweeterResponse>(
    StatusLambdaHelper,
    request,
    "postStatus",
    ["token"],         
    undefined,         
    request.token!,
    request.newStatus
  );
};
