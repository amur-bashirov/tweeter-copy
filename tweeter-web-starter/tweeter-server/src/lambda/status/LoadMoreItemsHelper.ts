

import { LoadMoreItemRequest, LoadMoreItemsResponse } from "tweeter-shared";
import { StatusLambdaHelper } from "./StatusLambdaHelper";
import { LambdaRunner } from "../LambdaRunner";
import { StatusService } from "../../model/service/StatusService";

export const itemsHandler = async (
  request: LoadMoreItemRequest,
  method: "loadMoreStoryItems" | "loadMoreFeedItems"
): Promise<LoadMoreItemsResponse> => {

  return LambdaRunner.run<StatusService, LoadMoreItemRequest, LoadMoreItemsResponse>(
    StatusLambdaHelper,
    request,
    method,
    [],                
    undefined,         
    request.token!,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
};
